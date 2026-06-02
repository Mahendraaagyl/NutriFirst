# NutriFirst - Capstone Project Codingcamp DBS Foundation x Dicoding 2026

**ID Tim Capstone Project:** CC26-PSU102

Proyek ini adalah platform personalisasi gizi **NutriFirst** yang memadukan keahlian **Full-Stack Web Development** dan **Data Science / Artificial Intelligence** untuk memberikan rekomendasi menu makanan berbasis budget dan gizi dalam upaya pencegahan stunting.

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

NutriFirst dirancang sebagai solusi penanganan stunting melalui rekomendasi menu makanan bergizi seimbang yang menyesuaikan dengan budget pengguna. Proyek ini terdiri dari dua pilar utama:
1. **Fullstack Web Application**: Sistem web interaktif bagi pengguna akhir untuk melakukan login/registrasi, mengirimkan kriteria budget dan bahan makanan, melihat rekomendasi gizi yang dipersonalisasi, serta menyimpan riwayat pencarian/prediksi.
2. **Data Science & AI Service**: Pipeline analisis gizi makanan Indonesia, dashboard interaktif visualisasi data, serta model pembelajaran mendalam (Deep Learning) berbasis jaringan saraf tiruan (Neural Network) yang diekspos melalui REST API untuk memberikan skor kelayakan gizi secara *real-time*.

---

## 📁 Struktur Repositori

```text
NutriFirst-app-main/
├── AImodelNutrifirst/              # Data Science & AI Services (Python)
│   ├── AI_Pipeline/                # Pipeline & File Model Deep Learning
│   │   ├── AI_Model_NutriFirst.ipynb # Notebook pelatihan model
│   │   ├── nutri_model.keras       # File model neural network (diunduh dari Drive)
│   │   ├── scaler_nn.pkl           # File normalisasi scaler (diunduh dari Drive)
│   │   └── logs/                   # Log visualisasi TensorBoard
│   ├── api_ai_model.py             # Inference API REST FastAPI
│   ├── dashboard.py                # Dashboard Streamlit untuk analisis gizi
│   ├── main_data.csv               # Dataset menu makanan yang difilter
│   ├── nutrition_with_price.csv    # Dataset mentah
│   └── requirements.txt            # Dependensi Python
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

## ✨ Fitur Utama

| Pilar | Fitur | Keterangan |
|-------|-------|------------|
| **Fullstack Web App** | **Sistem Auth JWT** | Registrasi & Login aman menggunakan HttpOnly Cookie untuk menyimpan token JWT. |
| | **Rekomendasi Terintegrasi** | Mengirim kriteria ke backend, meminta skor gizi ke AI Service, dan menampilkan menu terbaik. |
| | **History Pelacakan** | Menyimpan riwayat pencarian rekomendasi ke database PostgreSQL per user. |
| **Data Science & AI** | **Deep Learning Model** | Klasifikasi kelayakan gizi makanan menggunakan arsitektur Neural Network (ResNet-Style). |
| | **Inference API (FastAPI)** | Menyajikan endpoint `/recommend` dan `/predict` secara cepat menggunakan FastAPI. |
| | **Dashboard Streamlit** | Visualisasi interaktif hubungan gizi, sebaran harga, analisis efisiensi protein, dan korelasi harga-gizi. |
| | **Export Data** | Mengunduh hasil filter menu dari dashboard Streamlit langsung ke format CSV. |

---

## 📥 Persiapan Model AI (Langkah Awal)

Sebelum menjalankan aplikasi, Anda harus mengunduh file model pembelajaran mendalam dan scalernya karena ukurannya yang besar.

1. Buka tautan Google Drive berikut:  
   👉 **[Download Model AI NutriFirst](https://drive.google.com/drive/folders/1tPR9K9CM5gO_rBTxl1cOLmTiPqq9p-Sq?usp=drive_link)**
   > [!IMPORTANT]  
   > Pastikan folder Google Drive tersebut telah dibagikan/memiliki akses bagi akun **`capstone@student.devacademy.id`** agar reviewer dapat melihat dan mengunduh berkas model.
2. Unduh file berikut:
   * `nutri_model.keras`
   * `scaler_nn.pkl`
3. Letakkan kedua file tersebut di dalam direktori proyek pada folder:  
   📂 `AImodelNutrifirst/AI_Pipeline/`

---

## 🚀 Panduan Instalasi & Cara Menjalankan

Lakukan langkah-langkah di bawah ini untuk menjalankan semua service di lingkungan lokal (*development*).

---

### 1. Data Science & AI Service (Python)

Pastikan Anda telah mengunduh model AI ke folder `AI_Pipeline/` sesuai petunjuk di atas.

#### A. Instalasi Dependensi
Buka terminal baru di root proyek dan masuk ke folder `AImodelNutrifirst`:
```bash
cd AImodelNutrifirst
pip install -r requirements.txt
```

#### B. Menjalankan Dashboard Streamlit
Untuk menjalankan visualisasi data dan eksplorasi data gizi:
```bash
streamlit run dashboard.py
```
* Dashboard akan berjalan di: `http://localhost:8501`

#### C. Menjalankan REST API FastAPI
Untuk menjalankan server inference model AI guna melayani permintaan prediksi dari backend:
```bash
uvicorn api_ai_model:app --reload
```
* API docs (Swagger UI) dapat diakses di: `http://localhost:8000/docs`

---

### 2. Backend Server (Node.js & Express)

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

### 3. Frontend Web Application (React & Vite)

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

* **Streamlit Cloud Dashboard (Online - Tanpa Install)**:  
  [https://nutrifirst-codebooster-codingcampdbs2026.streamlit.app](https://nutrifirst-codebooster-codingcampdbs2026.streamlit.app)
* **Unduh Model AI**:  
  [Google Drive Folder](https://drive.google.com/drive/folders/1tPR9K9CM5gO_rBTxl1cOLmTiPqq9p-Sq?usp=drive_link)
