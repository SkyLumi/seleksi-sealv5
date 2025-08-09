# seleksi-sealv5

# REST API Chatbot - Seleksi Magang SEAL

![AdonisJS](https://img.shields.io/badge/AdonisJS-v5.9-5A45FF?style=for-the-badge&logo=adonisjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-336791?style=for-the-badge&logo=postgresql)

REST API sederhana yang dibangun menggunakan **AdonisJS v5** dan **PostgreSQL** untuk sistem chatbot. ini dibuat untuk tugas seleksi magang Backend Developer.

API ini bisa untuk berinteraksi dengan layanan chatbot dari [api-majadigi-beckend](https://documentation-api-majadigi-beckend.vercel.app/chatbot.html), menyimpan riwayat percakapan, dan mengelola data tersebut melalui beberapa endpoint yang telah disediakan.

---

## Fitur Utama

### Fitur Wajib
- [x] **Kirim Pertanyaan**: Menerima pertanyaan dan meneruskannya ke API chatbot eksternal.
- [x] **Manajemen Percakapan**: Menyimpan riwayat pertanyaan pengguna dan jawaban dari bot ke dalam database.
- [x] **Ambil Riwayat**: Menyediakan endpoint untuk melihat semua percakapan dan detail pesan per percakapan.

### Implemented Features
- [x] **Validasi Input**: Menggunakan `Validator` bawaan AdonisJS untuk memastikan integritas data.
- [x] **Endpoint Delete**: Menyediakan fungsionalitas untuk menghapus percakapan atau pesan tertentu.
- [x] **Pagination**: Menerapkan paginasi pada endpoint untuk mengambil semua percakapan.
- [x] **Otorisasi Sederhana**: Mengamankan endpoint menggunakan *Static API Key* melalui middleware.

---

## Teknologi yang Digunakan

* **Framework**: AdonisJS v5
* **Bahasa**: TypeScript
* **Database**: PostgreSQL
* **ORM**: AdonisJS Lucid
* **HTTP Client**: Axios
* **Lainnya**: Luxon, UUID

---

## Instalasi & Setup Lokal

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/SkyLumi/seleksi-sealv5](https://github.com/SkyLumi/seleksi-sealv5)
    cd seleksi-sealv5
    ```

2.  **Install dependensi:**
    ```bash
    yarn install
    # atau bisa pakai npm
    # npm install
    ```

3.  **Setup Environment Variables:**
    * Salin file `.env.example` menjadi `.env`.
    * Sesuaikan konfigurasi database (PostgreSQL) dan `API_SECRET_KEY` di dalam file `.env`.

4.  **Jalankan Migrasi Database:**
    Perintah ini akan membuat semua tabel yang dibutuhkan di database PostgreSQL Kamu.
    ```bash
    node ace migration:run
    ```

5.  **Jalankan Server Development:**
    ```bash
    yarn dev
    # or
    # node ace serve --watch
    ```
    Server akan berjalan di `http://127.0.0.1:(yang kamu setting di env)`.

---

##  API Endpoints & Penggunaan

### Otentikasi
Semua endpoint di bawah ini diproteksi dan memerlukan **API Key**. Sertakan key tersebut di dalam *header* setiap *request*:

* **Header Key**: `X-API-KEY`
* **Header Value**: Nilai `API_SECRET_KEY` yang ada di file `.env` Kamu.

### 1. Kirim Pertanyaan
Mengirimkan pertanyaan baru dan mendapatkan jawaban dari bot.

* **Method**: `POST`
* **Endpoint**: `/api/questions`
* **Headers**:
    * `Content-Type`: `application/json`
    * `X-API-KEY`: `kunci-rahasia-kamu`
* **Body (JSON)**:
    ```json
    {
      "message": "Halo, ceritakan tentang budaya Indonesia",
      "sessionId": "opsional-jika-ingin-melanjutkan-percakapan"
    }
    ```
* **Contoh Respons Sukses**:
    ```json
    {
        "status": 200,
        "message": "success",
        "sessionId": "b1a3d5e7-...",
        "data": [
            {
                "text": "Tentu, budaya Indonesia sangat beragam...",
                "category": "answer",
                "suggest_links": []
            }
        ]
    }
    ```

### 2. Ambil Semua Percakapan (dengan Paginasi)
Menampilkan semua riwayat percakapan.

* **Method**: `GET`
* **Endpoint**: `/api/conversations`
* **Query Params (Opsional)**:
    * `page`: Nomor halaman (default: `1`)
    * `limit`: Jumlah data per halaman (default: `10`)
    * Contoh: `/api/conversations?page=1&limit=5`
* **Headers**:
    * `X-API-KEY`: `kunci-rahasia-kamu`

### 3. Ambil Detail Percakapan
Menampilkan satu percakapan beserta semua pesannya berdasarkan ID.

* **Method**: `GET`
* **Endpoint**: `/api/conversations/:id`
* **Headers**:
    * `X-API-KEY`: `kunci-rahasia-kamu`

### 4. Hapus Percakapan
Menghapus satu percakapan berdasarkan ID.

* **Method**: `DELETE`
* **Endpoint**: `/api/conversations/:id`
* **Headers**:
    * `X-API-KEY`: `kunci-rahasia-kamu`

### 5. Hapus Pesan
Menghapus satu pesan spesifik berdasarkan ID.

* **Method**: `DELETE`
* **Endpoint**: `/api/messages/:id`
* **Headers**:
    * `X-API-KEY`: `kunci-rahasia-kamu`

---
## ⚙️ Environment Variables
Pastikan variabel ini ada di dalam file `.env` Kamu:

```dotenv
HOST=0.0.0.0
PORT=3333
NODE_ENV=development
APP_KEY=...
DRIVE_DISK=local

# Konfigurasi Database
DB_CONNECTION=pg
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=...
PG_DB_NAME=...

# Kunci Rahasia untuk Otentikasi API
API_SECRET_KEY=...
```