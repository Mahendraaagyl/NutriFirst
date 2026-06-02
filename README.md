# NutriFirst - Capstone Project Codingcamp DBS Foundation x Dicoding 2026

**ID Tim Capstone Project:** CC26-PSU102

Proyek ini adalah platform personalisasi gizi **NutriFirst** yang memadukan keahlian **FullStack**, **AI Engineer**, dan **Data Science** untuk memberikan rekomendasi menu makanan berbasis budget dan gizi dalam upaya pencegahan stunting.

---

## 👥 List Anggota Tim

| No | ID | Nama | Role |
|----|-----|------|------|
| 1 | CFCC185D6Y2119 | Benedictus Pascal Sanjaya | Full-Stack Web Developer |
| 2 | CFCC185D6Y2818 | Benediktus Geraldi | Full-Stack Web Developer |
| 3 | CDCC185D6Y2675 | Arel Lafito Dinoris | Data Scientist |
| 4 | CDCC185D6Y2746 | Jose Morinho Ngadio | Data Scientist |
| 5 | CACC126D6Y0062 | Farid Rilani Hakim | AI Engineer |
| 6 | CACC126D6Y0053 | Mahendra Agyal Kautsar | AI Engineer |

---

## 📋 Deskripsi Proyek

NutriFirst dirancang sebagai solusi penanganan stunting melalui rekomendasi menu makanan bergizi seimbang yang menyesuaikan dengan budget pengguna. Proyek ini terdiri dari tiga pilar utama yang saling terintegrasi:

1. **FullStack**:
   * Aplikasi web interaktif berbasis React (Vite) untuk menampilkan visualisasi rekomendasi gizi yang dipersonalisasi.
   * RESTful API backend berbasis Express.js dengan ORM Prisma (PostgreSQL) untuk mencatat riwayat rekomendasi pengguna secara aman menggunakan otentikasi JWT.
2. **AI Engineer**:
   * Pemodelan Deep Learning (Neural Network) menggunakan TensorFlow Functional API / Subclassing untuk klasifikasi kelayakan gizi menu makanan.
   * Implementasi komponen kustom (`CustomDenseLayer`) serta ekspor model ke format siap produksi (`.keras`).
   * REST API mandiri menggunakan FastAPI & Uvicorn untuk memproses inference skor kelayakan gizi secara *real-time*.
   * Integrasi TensorBoard untuk pemantauan dan visualisasi metrik pelatihan model.
3. **Data Science**:
   * Data Wrangling secara end-to-end (Gathering, Assessing, dan Cleaning data gizi makanan Indonesia).
   * Analisis Data Eksploratif (EDA) untuk mengukur korelasi harga vs protein dan memahami profil gizi menu.
   * Pengembangan dan deployment dashboard interaktif berbasis Streamlit ke Streamlit Cloud untuk visualisasi data gizi publik.

---

## 📁 Struktur Repositori

```text
NutriFirst-app-main/
├── AImodelNutrifirst/              # Python Services (AI Engineer & Data Science)
│   ├── AI_Pipeline/                # Pipeline & File Model (AI Engineer)
│   │   ├── AI_Model_NutriFirst.ipynb # Notebook pelatihan model (AI & Data Science)
│   │   ├── nutri_model.keras       # File model neural network (AI Engineer - diunduh dari Drive)
│   │   ├── scaler_nn.pkl           # File normalisasi scaler (AI Engineer - diunduh dari Drive)
│   │   └── logs/                   # Log visualisasi TensorBoard (AI Engineer)
│   ├── api_ai_model.py             # Inference API REST FastAPI (AI Engineer)
│   ├── dashboard.py                # Dashboard Streamlit untuk analisis gizi (Data Science)
│   ├── main_data.csv               # Dataset menu makanan hasil wrangling (Data Science)
│   ├── nutrition_with_price.csv    # Dataset mentah (Data Science)
│   └── requirements.txt            # Dependensi Python (AI Engineer & Data Science)
├── backend/                        # Backend REST API (Node.js & Express)
│   ├── api/                        # Serverless handler (untuk Vercel)
│   ├── prisma/                     # Konfigurasi ORM Prisma & Skema PostgreSQL
│   │   └── schema.prisma
│   ├── src/                        # Source code Express Server
│   │   ├── controllers/            # Logika bisnis endpoint (auth & rekomendasi)
│   │   ├── middleware/             # Middleware otentikasi (JWT)
│   │   ├── routes/                 # Definisi rute Express
│   │   ├── lib/                    # Instance helper database
│   │   ├── app.js                  # Konfigurasi aplikasi
│   │   └── server.js               # Entry point server lokal
│   ├── .env.example                # Template variabel lingkungan backend
│   └── package.json
└── frontend/                       # Frontend Web Application (React & Vite)
    ├── src/                        # Source code React (TailwindCSS)
    │   ├── api/                    # Konfigurasi Axios client
    │   ├── components/             # Reusable UI components
    │   ├── context/                # State management auth & user
    │   ├── pages/                  # Halaman aplikasi (Login, Register, Dashboard)
    │   └── App.jsx
    ├── .env.example                # Template variabel lingkungan frontend
    ├── tailwind.config.js
    └── package.json
```

---

## ✨ Fitur Utama & Checklist Capstone

### 1. FullStack
* **Panggilan API & Module Bundler**: Integrasi call API Axios dalam bundling Vite React.
* **RESTful API Express**: API terstandarisasi dengan endpoint `/api/auth` dan `/api/recommend`.
* **Penyimpanan Database**: Pencatatan riwayat prediksi menu gizi ke dalam database PostgreSQL menggunakan Prisma ORM.
* **Keamanan**: Implementasi otentikasi JWT yang disimpan via HttpOnly cookie untuk melindungi riwayat data user.

### 2. AI Engineer
* **Model Deep Learning**: Pembuatan arsitektur Neural Network menggunakan TensorFlow Functional API.
* **Komponen Kustom**: Implementasi kustom layer (`CustomDenseLayer`) terserialisasi dalam model.
* **Inference REST API**: REST API mandiri dengan FastAPI untuk merespons kalkulasi kelayakan menu secara instan.
* **TensorBoard Monitoring**: Visualisasi performa proses pelatihan model AI melalui TensorBoard log.
* **Performa Model Teruji**: Memenuhi syarat performa minimal akurasi 85% dan MAE maksimal 0.02.

### 3. Data Science
* **Wrangling Data**: End-to-end wrangling data gizi menu Indonesia (Gathering, Assessing, dan Cleaning data).
* **Exploratory Data Analysis (EDA)**: Menjawab pertanyaan bisnis mengenai korelasi harga dan gizi menu.
* **Dashboard Streamlit**: Visualisasi grafis hubungan nutrisi (protein, kalori, lemak) dan harga.
* **Streamlit Cloud Deployment**: Dashboard Streamlit dideploy secara publik agar dapat diakses oleh reviewer/publik.

---

## 📥 Persiapan Model AI (Langkah Awal)

Sebelum menjalankan aplikasi, Anda harus mengunduh file model pembelajaran mendalam dan scalernya karena ukurannya yang besar.

1. Buka tautan Google Drive berikut:  
   👉 **[Download Model AI NutriFirst](https://drive.google.com/drive/folders/1tPR9K9CM5gO_rBTxl1cOLmTiPqq9p-Sq?usp=drive_link)**
2. Unduh file berikut:
   * `nutri_model.keras`
   * `scaler_nn.pkl`
3. Letakkan kedua file tersebut di dalam direktori proyek pada folder:  
   📂 `AImodelNutrifirst/AI_Pipeline/`

---

## 🚀 Panduan Instalasi & Cara Menjalankan

Lakukan langkah-langkah di bawah ini untuk menjalankan semua service di lingkungan lokal (*development*).

---

### 1. AI Engineer (FastAPI Inference Service)

Pastikan file model AI hasil unduh sudah berada di folder `AImodelNutrifirst/AI_Pipeline/`.

#### A. Instalasi Dependensi
Buka terminal baru di root proyek, masuk ke folder `AImodelNutrifirst`, lalu instal dependensi Python:
```bash
cd AImodelNutrifirst
pip install -r requirements.txt
```

#### B. Menjalankan REST API FastAPI
```bash
uvicorn api_ai_model:app --reload
```
* REST API akan berjalan di: `http://localhost:8000`
* Dokumentasi API (Swagger UI) dapat diakses di: `http://localhost:8000/docs`
* Visualisasi TensorBoard: `tensorboard --logdir AI_Pipeline/logs/fit` (lahu buka `http://localhost:6006`)

---

### 2. Data Science (Dashboard Streamlit)

Dashboard ini digunakan untuk menampilkan insight, grafik visualisasi gizi, dan eksplorasi menu makanan.

#### A. Menjalankan Dashboard
Di terminal yang sama (atau pastikan sudah masuk ke folder `AImodelNutrifirst`):
```bash
streamlit run dashboard.py
```
* Dashboard Streamlit lokal akan terbuka secara otomatis di: `http://localhost:8501`

---

### 3. FullStack - Backend (Express & Prisma)

#### A. Instalasi Dependensi
Buka terminal baru di root proyek dan masuk ke folder `backend`:
```bash
cd backend
npm install
```

#### B. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi di dalam file `.env`:
* `DATABASE_URL`: Sesuaikan dengan koneksi database PostgreSQL Anda.
* `JWT_SECRET`: Isi dengan string acak rahasia untuk tanda tangan token JWT.

#### C. Inisialisasi Database (Prisma)
Jalankan migrasi schema dan generate prisma client:
```bash
npx prisma db push
npx prisma generate
```

#### D. Menjalankan Express Server
```bash
npm run dev
```
* Backend API akan berjalan di: `http://localhost:5000`
* Anda dapat mengecek status backend di: `http://localhost:5000/api/health`

---

### 4. FullStack - Frontend (React & Vite)

#### A. Instalasi Dependensi
Buka terminal baru di root proyek dan masuk ke folder `frontend`:
```bash
cd frontend
npm install
```

#### B. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Pastikan isi variabel lingkungan mengarah ke URL Express Backend:
```env
VITE_API_URL="http://localhost:5000/api"
```

#### C. Menjalankan Aplikasi Frontend
```bash
npm run dev
```
* Aplikasi frontend akan berjalan di: `http://localhost:5173`
* Buka browser dan arahkan ke alamat di atas untuk berinteraksi dengan aplikasi.

---

## 🔗 Tautan Penting & Live Demo

* **Streamlit Cloud Dashboard (Data Science - Live)**:  
  [https://nutrifirst-codebooster-codingcampdbs2026.streamlit.app](https://nutrifirst-codebooster-codingcampdbs2026.streamlit.app)
* **Unduh Model AI (AI Engineer)**:  
  [Google Drive Folder](https://drive.google.com/drive/folders/1tPR9K9CM5gO_rBTxl1cOLmTiPqq9p-Sq?usp=drive_link)
