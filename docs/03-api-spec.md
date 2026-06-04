# API Specification

> Dokumentasikan setiap endpoint yang dikembangkan maupun yang dikonsumsi dari layanan eksternal.
> Salin dan ulangi blok di bawah untuk setiap endpoint tambahan.

---

## [Register User]

**Method:** `POST`

**URL:** `/api/v1/[resource]`

**Deskripsi:** `Mendaftarkan pengguna baru ke dalam sistem PetCare.`

**Autentikasi Diperlukan:** `Tidak`

**Sumber:** `Internal System`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Victoria"
  "email": "victoria@email.com",
  "password": "password123"
}
```

**Response Sukses (`200 Created`):**
```json
{
  "status": "success",
  "message": "Registrasi berhasil"
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Email sudah digunakan"
}
```

---

## Login User

**Method:** `POST`

**URL:** `/api/v1/weather`

**Deskripsi:** Autentikasi pengguna dan menghasilkan token akses.

**Autentikasi Diperlukan:** `Tidak`

**Sumber:** `Internal System`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** `-`

**Request Body:**
```json
{
  "email": "victoria@email.com",
  "password": "password123"
}
```

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "token": "jwt_token"
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

---

## Get Services

**Method:** `GET`

**URL:** `/api/v1/services`

**Deskripsi:** Menampilkan seluruh layanan klinik dan grooming yang tersedia.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama_layanan": "Grooming Kucing",
      "harga": 75000
    }
  ]
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

---

## Add Pet

**Method:** `POST`

**URL:** `/api/v1/pets`

**Deskripsi:** Menambahkan data hewan peliharaan milik pengguna.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nama_hewan": "Milo",
  "jenis": "Kucing",
  "umur": 2
}
```

**Response Sukses (`201 Created`):**
```json
{
  "status": "success",
  "message": "Data hewan berhasil ditambahkan"
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Data tidak valid"
}
```

---

## Create Reservation

**Method:** `POST`

**URL:** `/api/v1/reservations`

**Deskripsi:** Membuat reservasi layanan klinik atau grooming.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "pet_id": 1,
  "service_id": 2,
  "tanggal": "2026-06-10"
}
```

**Response Sukses (`201 Created`):**
```json
{
  "status": "success",
  "message": "Reservasi berhasil dibuat"
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Jadwal tidak tersedia"
}
```

---

## Get Reservation History

**Method:** `GET`

**URL:** `/api/v1/reservations`

**Deskripsi:** Menampilkan riwayat reservasi pengguna.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "layanan": "Grooming Kucing",
      "tanggal": "2026-06-10",
      "status": "Menunggu Konfirmasi"
    }
  ]
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

---

## Update Reservation Status (Admin)

**Method:** `PUT`

**URL:** `/api/v1/reservations/{id}`

**Deskripsi:** Mengubah status reservasi oleh admin.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Selesai"
}
```

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "message": "Status reservasi berhasil diperbarui"
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Reservasi tidak ditemukan"
}
```
