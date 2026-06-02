# NutriFirst - Capstone Project Codingcamp DBS Foundation x Dicoding 2026 - Data Scientist

**ID Tim Capstone Project:** CC26-PSU102

## 👥 List Anggota
| No | ID | Nama | Role |
|----|-----|------|------|
| 1 | CFCC185D6Y2119 | Benedictus Pascal Sanjaya | Full-Stack Web Developer |
| 2 | CFCC185D6Y2818 | Benediktus Geraldi | Full-Stack Web Developer |
| 3 | CDCC185D6Y2675 | Arel Lafito Dinoris | Data Scientist |
| 4 | CDCC185D6Y2746 | Jose Morinho Ngadio | Data Scientist |
| 5 | CACC126D6Y0062 | Farid Rilani Hakim | AI Engineer |
| 6 | CACC126D6Y0053 | Mahendra Agyal Kautsar | AI Engineer |

---

## 📋 Deskripsi
NutriFirst adalah aplikasi web personalisasi yang memberikan rekomendasi menu makanan berdasarkan **budget** serta menampilkan detail analisis gizi (protein, kalori, lemak, karbohidrat) untuk membantu penurunan angka stunting. Dashboard ini menganalisis data gizi dan harga menu makanan Indonesia untuk mendukung sistem rekomendasi yang cerdas.

---

## ✨ Fitur Utama
| Fitur | Keterangan |
|-------|-------------|
| **Filter Interaktif (Slicer)** | Filter berdasarkan bahan dasar (ayam, sapi, telur), harga, kalori, dan protein |
| **Pagination** | Navigasi halaman untuk melihat daftar menu dengan jumlah fleksibel |
| **Analisis Harga** | Distribusi dan statistik harga per bahan dasar |
| **Analisis Gizi** | Hubungan protein vs lemak, matriks korelasi antar nutrisi |
| **Rekomendasi** | Menu dengan protein tinggi (>20g), rendah lemak (<15g) & karbohidrat (<20g) |
| **Korelasi Harga vs Protein** | Insight apakah harga mahal menjamin protein tinggi |
| **Export Data** | Download daftar menu ke CSV |
| **Deep Learning Model** | Model klasifikasi kelayakan gizi (ResNet-Style Architecture) |
| **AI Inference API** | REST API standalone (FastAPI) melayani prediksi skor gizi secara *real-time* |
| **TensorBoard Logging** | Visualisasi dan monitoring performa pelatihan model AI |

---

## 🚀 Cara Instalasi & Menjalankan

### 📌 Manual (Local Development)

1. Clone repository  
https://github.com/ArelDinoris/NutriFirst.git 

2. Masuk ke folder proyek  
cd nutrifirst-dashboard  

3. Install dependencies  
pip install -r requirements.txt  

4. Jalankan dashboard (Tim Data Science)
streamlit run dashboard.py  

5. Jalankan Inference API (Tim AI)
uvicorn api_ai_model:app --reload

6. Buka browser  
- Dashboard: http://localhost:8501  
- AI API (Swagger UI): http://localhost:8000/docs
- TensorBoard: `tensorboard --logdir AI_Pipeline/logs/fit` (lalu buka http://localhost:6006)

---

### 🌐 Otomatis (Online - Tanpa Install)

Akses GitHub repository  
https://github.com/ArelDinoris/NutriFirst.git  

Buka file **url.txt** lalu klik URL berikut  
https://nutrifirst-codebooster-codingcampdbs2026.streamlit.app  

Dashboard akan terbuka di browser Anda.

---

## 📁 Struktur File
NutriFirst/  
├── AI_Pipeline/  
│   ├── AI_Model_NutriFirst.ipynb — Notebook pembuatan & training model AI
│   ├── nutri_model.keras — Model Deep Learning tersimpan
│   ├── scaler_nn.pkl — Scaler untuk normalisasi data Inference
│   └── logs/ — Direktori log untuk visualisasi TensorBoard
├── api_ai_model.py — Standalone REST API Server (FastAPI)
├── dashboard.py — Kode utama dashboard Streamlit  
├── main_data.csv — Data hasil filtering untuk dashboard  
├── nutrition_with_price.csv — Dataset asli (mentah)  
├── README.md — Dokumentasi proyek  
├── requirements.txt — Daftar library yang dibutuhkan  
└── url.txt — URL deployment Streamlit Cloud
