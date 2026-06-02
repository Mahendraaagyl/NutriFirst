import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.layers import Layer
import numpy as np
import pandas as pd
import joblib

# ============================================================
# 1. Custom Layer Registration
# ============================================================
@tf.keras.utils.register_keras_serializable()
class CustomDenseLayer(Layer):
    def __init__(self, units, activation=None, **kwargs):
        super(CustomDenseLayer, self).__init__(**kwargs)
        self.units = units
        self.activation = tf.keras.activations.get(activation)

    def build(self, input_shape):
        self.w = self.add_weight(shape=(input_shape[-1], self.units), initializer='he_normal', trainable=True, name='kernel')
        self.b = self.add_weight(shape=(self.units,), initializer='zeros', trainable=True, name='bias')
        super(CustomDenseLayer, self).build(input_shape)

    def call(self, inputs):
        output = tf.matmul(inputs, self.w) + self.b
        if self.activation is not None:
            output = self.activation(output)
        return output

    def get_config(self):
        config = super().get_config()
        config.update({
            "units": self.units,
            "activation": tf.keras.activations.serialize(self.activation),
        })
        return config

# ============================================================
# 2. FastAPI App
# ============================================================
app = FastAPI(
    title="NutriFirst AI Inference API",
    description="REST API Neural Network untuk Rekomendasi & Skoring Kelayakan Gizi",
    version="2.0"
)

# CORS - izinkan backend Express memanggil AI Service
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 3. Load Model, Scaler, dan Dataset Menu
# ============================================================
FEATURES = ['calories', 'proteins', 'fat', 'carbohydrate', 'harga']

print("Loading model & scaler...")
model = tf.keras.models.load_model(
    'AI_Pipeline/nutri_model.keras',
    custom_objects={'CustomDenseLayer': CustomDenseLayer}
)
scaler_nn = joblib.load('AI_Pipeline/scaler_nn.pkl')

print("Loading menu catalog...")
df_menu = pd.read_csv('main_data.csv')
# Pre-scale fitur seluruh menu (untuk efisiensi)
menu_features_scaled = scaler_nn.transform(df_menu[FEATURES].values)
# Pre-compute prediksi untuk semua menu (sekali saja saat startup)
print("Pre-computing AI scores for all menus...")
ALL_SCORES = model.predict(menu_features_scaled, verbose=0).flatten()
print(f"Ready! Loaded {len(df_menu)} menus.")

# ============================================================
# 4. Helper Functions
# ============================================================
def map_to_class(score):
    if score <= 25: return '1. Tidak Layak'
    elif score <= 50: return '2. Kurang Layak'
    elif score <= 75: return '3. Layak'
    else: return '4. Sangat Layak'

def parse_price_range(label: str):
    """Parse string dropdown ke (min, max). Support format Figma."""
    label = label.strip()
    if '<=' in label:
        return (0, 10000)
    if '>=' in label:
        return (25000, float('inf'))
    # Format: "11000 - 15000" (no dots) atau "11.000 - 15.000" (legacy)
    parts = label.replace('.', '').split('-')
    return (int(parts[0].strip()), int(parts[1].strip()))

def build_menu_response(idx: int, score: float):
    """Bangun object response satu menu dari row CSV + skor AI"""
    row = df_menu.iloc[idx]
    return {
        "id": int(row['id']),
        "name": str(row['name']),
        "image": str(row['image']),
        "bahan_dasar": str(row.get('bahan_dasar', '')),
        "calories": float(row['calories']),
        "proteins": float(row['proteins']),
        "fat": float(row['fat']),
        "carbohydrate": float(row['carbohydrate']),
        "harga": float(row['harga']),
        "skor_regresi": round(float(score), 2),
        "kategori_kelayakan": map_to_class(float(score)),
    }

# ============================================================
# 5. Schemas
# ============================================================
class NutrisiInput(BaseModel):
    calories: float
    proteins: float
    fat: float
    carbohydrate: float
    harga: float

class RecommendInput(BaseModel):
    ingredient: str    # "Ayam" | "Sapi" | "Telur"
    priceRange: str    # "<= 10.000" | "11.000 - 15.000" | ...

# ============================================================
# 6. Endpoints
# ============================================================
@app.get("/")
def read_root():
    return {
        "message": "NutriFirst AI Service v2.0",
        "endpoints": ["/predict", "/recommend", "/docs"],
        "total_menus": len(df_menu)
    }

@app.post("/predict")
def predict_nutrisi(data: NutrisiInput):
    """Inference langsung dari nilai nutrisi mentah (untuk testing)"""
    input_data = np.array([[data.calories, data.proteins, data.fat,
                             data.carbohydrate, data.harga]])
    input_scaled = scaler_nn.transform(input_data)
    prediksi = float(model.predict(input_scaled, verbose=0)[0][0])
    return {
        "status": "success",
        "input_diterima": data.dict(),
        "hasil_prediksi": {
            "skor_regresi": round(prediksi, 2),
            "kategori_kelayakan": map_to_class(prediksi)
        }
    }

@app.post("/recommend")
def recommend_menu(data: RecommendInput):
    """
    Endpoint utama untuk dashboard:
    Filter menu berdasarkan ingredient + range harga,
    jalankan inference Neural Network,
    return 1 menu terbaik + 4 alternatif (urut skor descending).
    """
    bahan = data.ingredient.strip().lower()
    if bahan not in ['ayam', 'sapi', 'telur']:
        raise HTTPException(400, "Bahan utama harus salah satu: Ayam, Sapi, Telur")

    try:
        price_min, price_max = parse_price_range(data.priceRange)
    except Exception:
        raise HTTPException(400, "Format range harga tidak valid")

    # FILTER: cari indeks menu yang cocok
    mask = (
        (df_menu['bahan_dasar'].str.lower().str.strip() == bahan) &
        (df_menu['harga'] >= price_min) &
        (df_menu['harga'] <= price_max)
    )
    matched_idx = np.where(mask)[0]

    if len(matched_idx) == 0:
        return {
            "status": "not_found",
            "message": f"Tidak ada menu '{data.ingredient}' di rentang harga '{data.priceRange}'.",
            "input_diterima": data.dict(),
        }

    # AMBIL SKOR (sudah pre-computed dari Neural Network)
    matched_scores = ALL_SCORES[matched_idx]

    # SORT descending berdasarkan skor
    sorted_order = np.argsort(-matched_scores)
    matched_idx_sorted = matched_idx[sorted_order]
    matched_scores_sorted = matched_scores[sorted_order]

    # Bangun response: 1 terbaik + maksimal 4 alternatif
    top_idx = matched_idx_sorted[0]
    top_score = matched_scores_sorted[0]
    alt_idx = matched_idx_sorted[1:5]   # ambil 4 berikutnya
    alt_scores = matched_scores_sorted[1:5]

    menu_terbaik = build_menu_response(top_idx, top_score)
    alternatif = [build_menu_response(i, s) for i, s in zip(alt_idx, alt_scores)]

    return {
        "status": "success",
        "input_diterima": data.dict(),
        "total_kandidat": int(len(matched_idx)),
        "menu_terbaik": menu_terbaik,
        "alternatif": alternatif,
    }

# ============================================================
# 7. Local Server (untuk dev)
# ============================================================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)