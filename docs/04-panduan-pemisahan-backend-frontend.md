# Panduan Pemisahan Backend (REST API) dan Frontend (SPA)

Dokumen ini menjelaskan struktur arsitektur baru setelah pemisahan kode frontend (React) dari server backend (Laravel) serta langkah-langkah teknis untuk mengembangkan aplikasi lebih lanjut.

---

## 1. Arsitektur Pemisahan

Aplikasi **PatCare** kini terbagi menjadi dua bagian independen:
1. **Backend (Laravel REST API)**: Hanya berfungsi sebagai penyedia data melalui endpoint JSON. Tidak lagi melayani rendering halaman HTML (Blade views).
2. **Frontend (React)**: Bertindak sebagai Single Page Application (SPA) yang berjalan di server terpisah (Vite) dan mengonsumsi data dari REST API Backend menggunakan fetch HTTP request.

---

## 2. Perubahan Sisi Backend (REST API)

### A. Rute Utama & API
Rute web dinonaktifkan dari melayani berkas HTML. Rute utama `/` kini mengembalikan indikator status API:

#### Berkas: `Backend/routes/web.php`
```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'PatCare REST API is running'
    ]);
});
```

Rute statistik dashboard dipindahkan ke API routes agar dapat dikonsumsi oleh aplikasi klien:

#### Berkas: `Backend/routes/api.php`
```php
use App\Http\Controllers\DashboardController;

// DASHBOARD STATS
Route::get('/dashboard', [DashboardController::class, 'index']);
```

### B. Controller Statistik (JSON Response)
Controller dashboard diubah agar mengembalikan data berformat JSON:

#### Berkas: `Backend/app/Http/Controllers/DashboardController.php`
```php
<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Service;
use App\Models\Reservation;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'totalPets' => Pet::count(),
                'totalServices' => Service::count(),
                'totalReservations' => Reservation::count(),
                'totalUsers' => User::count(),
            ]
        ]);
    }
}
```

### C. Pembersihan Berkas Frontend pada Backend
Untuk menjadikan backend murni REST API, file berikut telah dihapus:
- `Backend/resources/views/welcome.blade.php` (Blade View welcome)
- `Backend/resources/views/dashboard.blade.php` (Blade View dashboard)
- `Backend/package.json` & `Backend/vite.config.js` (Konfigurasi npm & Vite backend)
- Folder `Backend/resources/css/` & `Backend/resources/js/` (Aset frontend backend)

---

## 3. Perubahan Sisi Frontend (React)

### A. Konfigurasi Endpoint API
Dibuat berkas konfigurasi terpusat untuk mendefinisikan alamat server REST API:

#### Berkas: `Frontend/src/config.js`
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
```

### B. Controller / Hook Dashboard
Dibuat custom hook baru untuk mengambil data statistik sistem secara real-time dari API Backend:

#### Berkas: `Frontend/src/controllers/useDashboardController.js`
```javascript
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useDashboardController() {
  const [stats, setStats] = useState({
    totalPets: 0,
    totalServices: 0,
    totalReservations: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 'success' && resData.data) {
          setStats(resData.data);
        } else {
          setStats({
            totalPets: resData.totalPets ?? 0,
            totalServices: resData.totalServices ?? 0,
            totalReservations: resData.totalReservations ?? 0,
            totalUsers: resData.totalUsers ?? 0,
          });
        }
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refreshStats: fetchStats };
}
```

### C. Controller / Hook Pengguna (API Integration)
Mengubah integrasi data pengguna agar langsung menembak ke endpoint lokal database backend, bukan menggunakan mock JSONPlaceholder lagi:

#### Berkas: `Frontend/src/controllers/useUserController.js`
```javascript
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useUserController() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/users`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((resData) => {
        setUsers(resData.data || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const hapusUser = (id) => {
    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
        alert(`Gagal menghapus user: ${err.message}`);
      });
  };

  return { users, loading, error, hapusUser, refreshUsers: fetchUsers };
}
```

---

## 4. Cara Menjalankan & Mengembangkan Aplikasi secara Lokal

### Langkah 1: Jalankan Database & Backend (Laravel API)
1. Buka terminal baru dan masuk ke folder **Backend**:
   ```bash
   cd Backend
   ```
2. Pastikan Anda memiliki data dummy di database agar statistik tidak bernilai nol (`0`). Jalankan seeder bawaan:
   ```bash
   php artisan db:seed
   ```
3. Jalankan server lokal Laravel:
   ```bash
   php artisan serve
   ```
   *Backend kini siap menerima request API di `http://127.0.0.1:8000`.*

### Langkah 2: Jalankan Frontend (React SPA)
1. Buka terminal baru dan masuk ke folder **Frontend**:
   ```bash
   cd Frontend
   ```
2. Jalankan Vite development server:
   ```bash
   npm run dev
   ```
3. Buka browser dan buka `http://localhost:5173`. Aplikasi React akan mengambil data dari server port `8000`.
