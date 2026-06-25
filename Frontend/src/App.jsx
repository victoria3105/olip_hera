import { useState, useEffect } from 'react';
import './App.css';

// Import Custom Hook Controllers
import { useUserController } from './controllers/useUserController';
import { useDashboardController } from './controllers/useDashboardController';
import { usePetController } from './controllers/usePetController';
import { useServiceController } from './controllers/useServiceController';
import { useReservationController } from './controllers/useReservationController';
import { API_BASE_URL } from './config';

function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('petcare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Login/Register Form State
  const [loginForm, setLoginForm] = useState({ email: 'test@example.com', password: 'password' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  // Navigation State
  const [activePage, setActivePage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState({
    master: true,
    reservasi: true,
    laporan: true,
  });

  // Role Detection
  const isAdmin = currentUser && (
    currentUser.email === 'test@example.com' ||
    currentUser.email.toLowerCase().includes('admin')
  );

  // Controllers Instantiation
  const { users, loading: usersLoading, error: usersError, hapusUser, refreshUsers } = useUserController();
  const { stats, loading: statsLoading, error: statsError, refreshStats } = useDashboardController();
  const { pets, loading: petsLoading, error: petsError, tambahPet, editPet, hapusPet, refreshPets } = usePetController();
  const { services, loading: servicesLoading, error: servicesError, tambahService, editService, hapusService, refreshServices } = useServiceController();
  const { reservations, loading: reservationsLoading, error: reservationsError, buatReservasi, batalReservasi, updateStatusReservasi, refreshReservations } = useReservationController();

  // Form States for CRUD
  const [petForm, setPetForm] = useState({ name: '', species: 'Kucing', breed: '', age: '', gender: 'Jantan', medical_history: '', user_id: '' });
  const [editingPetId, setEditingPetId] = useState(null);

  const [serviceForm, setServiceForm] = useState({ name: '', category: 'Grooming', description: '', price: '', duration_minutes: '30', is_active: 1 });
  const [editingServiceId, setEditingServiceId] = useState(null);

  const [reservationForm, setReservationForm] = useState({ user_id: '', pet_id: '', service_id: '', reservation_date: '', reservation_time: '', price: '', notes: '' });

  // Guard admin-only pages from standard users
  useEffect(() => {
    if (currentUser) {
      const adminOnlyPages = ['master-user', 'laporan-reservasi', 'laporan-hewan', 'laporan-layanan'];
      if (!isAdmin && adminOnlyPages.includes(activePage)) {
        setActivePage('dashboard');
      }
    }
  }, [activePage, currentUser]);

  // Set default values for forms when data is loaded
  useEffect(() => {
    if (currentUser && !isAdmin) {
      // For regular users, force lock the form inputs to their own user ID
      setPetForm(prev => ({ ...prev, user_id: currentUser.id }));
      setReservationForm(prev => ({ ...prev, user_id: currentUser.id }));
    } else if (users.length > 0 && !petForm.user_id) {
      setPetForm(prev => ({ ...prev, user_id: users[0].id }));
      setReservationForm(prev => ({ ...prev, user_id: users[0].id }));
    }
  }, [users, currentUser, activePage]);

  useEffect(() => {
    if (services.length > 0 && !reservationForm.service_id) {
      const firstSvc = services[0];
      setReservationForm(prev => ({ ...prev, service_id: firstSvc.id, price: firstSvc.price }));
    }
  }, [services]);

  // Filter pets in Reservation form
  // Admins can see pets for the selected owner, Users only see their own pets
  const activeReservationUserId = isAdmin ? reservationForm.user_id : (currentUser?.id || '');
  const filteredPetsForReservation = pets.filter(p => Number(p.user_id) === Number(activeReservationUserId));

  useEffect(() => {
    if (filteredPetsForReservation.length > 0 && !reservationForm.pet_id) {
      setReservationForm(prev => ({ ...prev, pet_id: filteredPetsForReservation[0].id }));
    } else if (filteredPetsForReservation.length === 0) {
      setReservationForm(prev => ({ ...prev, pet_id: '' }));
    }
  }, [activeReservationUserId, pets]);

  // Filter lists for regular users
  const myPets = pets.filter(p => Number(p.user_id) === Number(currentUser?.id));
  const myReservations = reservations.filter(r => Number(r.user_id) === Number(currentUser?.id));
  const myCompletedReservationsCount = myReservations.filter(r => r.status === 'Completed').length;

  // Handle Auth Login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    fetch(`${API_BASE_URL.replace('/api', '')}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Email atau password salah');
        }
        return res.json();
      })
      .then((resData) => {
        const user = resData.data;
        localStorage.setItem('petcare_user', JSON.stringify(user));
        setCurrentUser(user);
        refreshAllData();
      })
      .catch((err) => {
        console.error('Login error:', err);
        // Failover simulation for offline testing
        if (loginForm.email === 'test@example.com' && loginForm.password === 'password') {
          const simUser = { id: 99, name: 'Test User (Offline Admin)', email: 'test@example.com' };
          localStorage.setItem('petcare_user', JSON.stringify(simUser));
          setCurrentUser(simUser);
          setAuthSuccess('Bekerja dalam Mode Offline (Koneksi database gagal).');
          refreshAllData();
        } else {
          setAuthError(err.message || 'Koneksi ke backend gagal.');
        }
      });
  };

  // Handle Auth Register
  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    fetch(`${API_BASE_URL.replace('/api', '')}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Registrasi gagal. Email mungkin sudah terdaftar.');
        }
        return res.json();
      })
      .then(() => {
        setAuthSuccess('Registrasi berhasil! Silakan login menggunakan akun baru Anda.');
        setAuthMode('login');
        setLoginForm({ email: registerForm.email, password: registerForm.password });
        refreshUsers();
      })
      .catch((err) => {
        setAuthError(err.message || 'Koneksi ke backend gagal.');
      });
  };

  // Handle Logout
  const handleLogout = () => {
    fetch(`${API_BASE_URL.replace('/api', '')}/api/logout`, { method: 'POST' })
      .finally(() => {
        localStorage.removeItem('petcare_user');
        setCurrentUser(null);
      });
  };

  // Refresh all database states
  const refreshAllData = () => {
    refreshStats();
    refreshUsers();
    refreshPets();
    refreshServices();
    refreshReservations();
  };

  // CRUD Actions: Pet
  const handlePetSubmit = (e) => {
    e.preventDefault();
    // Ensure standard users cannot modify other user IDs
    const finalPetForm = {
      ...petForm,
      user_id: isAdmin ? petForm.user_id : currentUser.id,
    };

    if (editingPetId) {
      editPet(editingPetId, finalPetForm)
        .then(() => {
          setEditingPetId(null);
          resetPetForm();
        })
        .catch(err => alert(err.message));
    } else {
      tambahPet(finalPetForm)
        .then(() => resetPetForm())
        .catch(err => alert(err.message));
    }
  };

  const startEditPet = (p) => {
    setEditingPetId(p.id);
    setPetForm({
      name: p.name,
      species: p.species,
      breed: p.breed,
      age: p.age,
      gender: p.gender,
      medical_history: p.medical_history || '',
      user_id: p.user_id,
    });
  };

  const resetPetForm = () => {
    setPetForm({
      name: '',
      species: 'Kucing',
      breed: '',
      age: '',
      gender: 'Jantan',
      medical_history: '',
      user_id: isAdmin ? (users.length > 0 ? users[0].id : '') : currentUser.id,
    });
    setEditingPetId(null);
  };

  // CRUD Actions: Service
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (editingServiceId) {
      editService(editingServiceId, serviceForm)
        .then(() => {
          setEditingServiceId(null);
          resetServiceForm();
        })
        .catch(err => alert(err.message));
    } else {
      tambahService(serviceForm)
        .then(() => resetServiceForm())
        .catch(err => alert(err.message));
    }
  };

  const startEditService = (s) => {
    setEditingServiceId(s.id);
    setServiceForm({
      name: s.name,
      category: s.category,
      description: s.description || '',
      price: s.price,
      duration_minutes: s.duration_minutes || '30',
      is_active: s.is_active ? 1 : 0,
    });
  };

  const resetServiceForm = () => {
    setServiceForm({ name: '', category: 'Grooming', description: '', price: '', duration_minutes: '30', is_active: 1 });
    setEditingServiceId(null);
  };

  // Actions: Reservation
  const handleReservationSubmit = (e) => {
    e.preventDefault();
    // Enforce regular users book for themselves
    const finalResForm = {
      ...reservationForm,
      user_id: isAdmin ? reservationForm.user_id : currentUser.id,
      pet_id: reservationForm.pet_id || (filteredPetsForReservation.length > 0 ? filteredPetsForReservation[0].id : ''),
    };

    if (!finalResForm.pet_id) {
      alert('Pilih atau daftarkan hewan peliharaan terlebih dahulu!');
      return;
    }

    buatReservasi(finalResForm)
      .then(() => {
        alert('Reservasi berhasil dibuat!');
        setReservationForm(prev => ({
          ...prev,
          notes: '',
        }));
        setActivePage('reservasi-jadwal');
      })
      .catch(err => alert(err.message));
  };

  const handleServiceChangeInReservation = (svcId) => {
    const selectedSvc = services.find(s => Number(s.id) === Number(svcId));
    setReservationForm(prev => ({
      ...prev,
      service_id: svcId,
      price: selectedSvc ? selectedSvc.price : '',
    }));
  };

  // Toggle navigation dropdown menus
  const toggleMenu = (key) => {
    setMenuOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helpers to resolve names for display
  const getUserName = (id) => users.find(u => Number(u.id) === Number(id))?.name || `User ID ${id}`;
  const getPetName = (id) => pets.find(p => Number(p.id) === Number(id))?.name || `Pet ID ${id}`;
  const getServiceName = (id) => services.find(s => Number(s.id) === Number(id))?.name || `Service ID ${id}`;

  // Render Authentication pages if not logged in
  if (!currentUser) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>🐾 PetCare</h2>
            <p>Sistem Reservasi Perawatan Hewan Peliharaan</p>
          </div>

          {authError && <div className="text-danger mb-4 text-center">{authError}</div>}
          {authSuccess && <div style={{ color: '#10b981', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>{authSuccess}</div>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group mb-4">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="form-group mb-4">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Sign In
              </button>
              <div className="auth-footer">
                Belum punya akun?{' '}
                <span className="auth-link" onClick={() => setAuthMode('register')}>
                  Daftar Sekarang
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group mb-4">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Victoria Sas"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>
              <div className="form-group mb-4">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
                <span style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                  *Email mengandung kata "admin" otomatis terdaftar sebagai Administrator.
                </span>
              </div>
              <div className="form-group mb-4">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Min. 8 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Sign Up
              </button>
              <div className="auth-footer">
                Sudah punya akun?{' '}
                <span className="auth-link" onClick={() => setAuthMode('login')}>
                  Login Masuk
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>🐾 PetCare {isAdmin ? '(Admin)' : ''}</span>
        </div>

        <div className="sidebar-menu">
          <div
            className={`menu-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <div className="menu-item-link">
              <span>🏠</span> Dashboard
            </div>
          </div>

          {/* Master Data Menu */}
          <div className="menu-group">
            <div className="menu-item" onClick={() => toggleMenu('master')}>
              <div className="menu-item-link">
                <span>📁</span> {isAdmin ? 'Master Data' : 'Informasi & Hewan'}
              </div>
              <span style={{ fontSize: '10px' }}>{menuOpen.master ? '▼' : '▲'}</span>
            </div>
            {menuOpen.master && (
              <ul className="submenu-list">
                <li
                  className={`submenu-item ${activePage === 'master-hewan' ? 'active' : ''}`}
                  onClick={() => setActivePage('master-hewan')}
                >
                  🐶 {isAdmin ? 'Hewan' : 'Hewan Saya'}
                </li>
                <li
                  className={`submenu-item ${activePage === 'master-layanan' ? 'active' : ''}`}
                  onClick={() => setActivePage('master-layanan')}
                >
                  ✂️ {isAdmin ? 'Layanan' : 'Katalog Layanan'}
                </li>
                {isAdmin && (
                  <li
                    className={`submenu-item ${activePage === 'master-user' ? 'active' : ''}`}
                    onClick={() => setActivePage('master-user')}
                  >
                    👥 User
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Reservasi Menu */}
          <div className="menu-group">
            <div className="menu-item" onClick={() => toggleMenu('reservasi')}>
              <div className="menu-item-link">
                <span>📅</span> Reservasi
              </div>
              <span style={{ fontSize: '10px' }}>{menuOpen.reservasi ? '▼' : '▲'}</span>
            </div>
            {menuOpen.reservasi && (
              <ul className="submenu-list">
                <li
                  className={`submenu-item ${activePage === 'reservasi-buat' ? 'active' : ''}`}
                  onClick={() => setActivePage('reservasi-buat')}
                >
                  ➕ Buat Reservasi
                </li>
                <li
                  className={`submenu-item ${activePage === 'reservasi-jadwal' ? 'active' : ''}`}
                  onClick={() => setActivePage('reservasi-jadwal')}
                >
                  ⏰ {isAdmin ? 'Jadwal Reservasi' : 'Jadwal Saya'}
                </li>
                <li
                  className={`submenu-item ${activePage === 'reservasi-riwayat' ? 'active' : ''}`}
                  onClick={() => setActivePage('reservasi-riwayat')}
                >
                  📜 {isAdmin ? 'Riwayat' : 'Riwayat Saya'}
                </li>
              </ul>
            )}
          </div>

          {/* Laporan Menu (Admin Only) */}
          {isAdmin && (
            <div className="menu-group">
              <div className="menu-item" onClick={() => toggleMenu('laporan')}>
                <div className="menu-item-link">
                  <span>📊</span> Laporan
                </div>
                <span style={{ fontSize: '10px' }}>{menuOpen.laporan ? '▼' : '▲'}</span>
              </div>
              {menuOpen.laporan && (
                <ul className="submenu-list">
                  <li
                    className={`submenu-item ${activePage === 'laporan-reservasi' ? 'active' : ''}`}
                    onClick={() => setActivePage('laporan-reservasi')}
                  >
                    📈 Reservasi
                  </li>
                  <li
                    className={`submenu-item ${activePage === 'laporan-hewan' ? 'active' : ''}`}
                    onClick={() => setActivePage('laporan-hewan')}
                  >
                    🐈 Hewan
                  </li>
                  <li
                    className={`submenu-item ${activePage === 'laporan-layanan' ? 'active' : ''}`}
                    onClick={() => setActivePage('laporan-layanan')}
                  >
                    💼 Layanan
                  </li>
                </ul>
              )}
            </div>
          )}

          <div
            className={`menu-item ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => setActivePage('profile')}
            style={{ marginTop: '14px' }}
          >
            <div className="menu-item-link">
              <span>👤</span> Profile
            </div>
          </div>

          <div className="menu-item" onClick={handleLogout} style={{ color: '#f87171' }}>
            <div className="menu-item-link">
              <span>🚪</span> Logout
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Container */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header className="top-header">
          <div className="header-title-section">
            <h3>{activePage.toUpperCase().replace('-', ' — ')}</h3>
          </div>
          <div className="header-user-section">
            <button onClick={refreshAllData} className="btn-premium" style={{ padding: '6px 12px', fontSize: '12px' }}>
              🔄 Sync
            </button>
            <span className="user-badge">
              👤 {currentUser.name} {isAdmin ? '(Admin)' : '(User)'}
            </span>
          </div>
        </header>

        {/* 3. Page Content Area */}
        <div className="content-body" key={activePage}>
          {/* A. DASHBOARD PAGE */}
          {activePage === 'dashboard' && (
            <div>
              <div className="card-premium">
                <h2>Selamat Datang di PetCare, {currentUser.name}! 🐾</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                  {isAdmin
                    ? 'Aplikasi klinik & grooming hewan terintegrasi secara profesional. Kelola seluruh reservasi, data hewan, dan laporan keuangan dalam satu dasbor yang bersih.'
                    : 'Pesan reservasi perawatan grooming atau klinik medis dengan cepat dan pantau riwayat penanganan hewan kesayangan Anda.'}
                </p>
              </div>

              {/* Grid Statistics Cards - Conditional on Role */}
              <div className="card-grid">
                <div className="stats-card">
                  <div className="stats-icon-wrapper">🐶</div>
                  <div className="stats-info">
                    <h5>{isAdmin ? 'Total Hewan' : 'Hewan Saya'}</h5>
                    <h2>{statsLoading ? '...' : (isAdmin ? stats.totalPets : myPets.length)}</h2>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="stats-icon-wrapper">✂️</div>
                  <div className="stats-info">
                    <h5>Katalog Layanan</h5>
                    <h2>{statsLoading ? '...' : stats.totalServices}</h2>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="stats-icon-wrapper">📅</div>
                  <div className="stats-info">
                    <h5>{isAdmin ? 'Total Reservasi' : 'Reservasi Saya'}</h5>
                    <h2>{statsLoading ? '...' : (isAdmin ? stats.totalReservations : myReservations.length)}</h2>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="stats-icon-wrapper">{isAdmin ? '👥' : '🟢'}</div>
                  <div className="stats-info">
                    <h5>{isAdmin ? 'Total User' : 'Selesai'}</h5>
                    <h2>{statsLoading ? '...' : (isAdmin ? stats.totalUsers : myCompletedReservationsCount)}</h2>
                  </div>
                </div>
              </div>

              {/* Quick Summary Widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card-premium" style={{ marginBottom: 0 }}>
                  <div className="card-header-premium">
                    <h4>{isAdmin ? 'Jadwal Reservasi Hari Ini' : 'Booking Aktif Saya'}</h4>
                  </div>
                  {reservationsLoading ? (
                    <p>Memuat data reservasi...</p>
                  ) : (isAdmin ? reservations : myReservations).filter(r => r.status === 'Pending').length === 0 ? (
                    <p style={{ fontStyle: 'italic', opacity: 0.7 }}>Tidak ada jadwal reservasi aktif/pending saat ini.</p>
                  ) : (
                    <div className="table-container">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            {isAdmin && <th>Pemilik</th>}
                            <th>Hewan</th>
                            <th>Layanan</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(isAdmin ? reservations : myReservations).filter(r => r.status === 'Pending').slice(0, 4).map((r) => (
                            <tr key={r.id}>
                              {isAdmin && <td>{getUserName(r.user_id)}</td>}
                              <td>{getPetName(r.pet_id)}</td>
                              <td>{getServiceName(r.service_id)}</td>
                              <td>
                                <span className={`badge-status ${r.status.toLowerCase()}`}>{r.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="card-premium" style={{ marginBottom: 0 }}>
                  <div className="card-header-premium">
                    <h4>Aksi Cepat Dasbor</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn-premium" onClick={() => setActivePage('reservasi-buat')} style={{ width: '100%', justifyContent: 'center' }}>
                      📅 Buat Reservasi Baru
                    </button>
                    <button className="btn-premium" onClick={() => setActivePage('master-hewan')} style={{ width: '100%', justifyContent: 'center', background: '#3b82f6' }}>
                      🐕 Daftarkan Hewan Peliharaan
                    </button>
                    {isAdmin && (
                      <button className="btn-premium" onClick={() => setActivePage('laporan-reservasi')} style={{ width: '100%', justifyContent: 'center', background: '#10b981' }}>
                        📈 Lihat Laporan Pendapatan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. MASTER DATA - HEWAN PAGE */}
          {activePage === 'master-hewan' && (
            <div>
              <div className="card-premium">
                <div className="card-header-premium">
                  <h4>{editingPetId ? '📝 Edit Data Hewan' : '➕ Daftarkan Hewan Baru'}</h4>
                </div>
                <form onSubmit={handlePetSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nama Hewan</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Milo"
                        value={petForm.name}
                        onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Jenis Hewan (Spesies)</label>
                      <select
                        className="form-control"
                        value={petForm.species}
                        onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                      >
                        <option value="Kucing">Kucing</option>
                        <option value="Anjing">Anjing</option>
                        <option value="Kelinci">Kelinci</option>
                        <option value="Burung">Burung</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ras (Breed)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Persia / Golden"
                        value={petForm.breed}
                        onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Umur (Tahun)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        placeholder="2"
                        value={petForm.age}
                        onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Jenis Kelamin</label>
                      <select
                        className="form-control"
                        value={petForm.gender}
                        onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                      >
                        <option value="Jantan">Jantan</option>
                        <option value="Betina">Betina</option>
                      </select>
                    </div>

                    {isAdmin && (
                      <div className="form-group">
                        <label>Pemilik (User)</label>
                        <select
                          className="form-control"
                          value={petForm.user_id}
                          onChange={(e) => setPetForm({ ...petForm, user_id: e.target.value })}
                        >
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-4">
                    <label>Riwayat Kesehatan (Keterangan Medis)</label>
                    <textarea
                      className="form-control"
                      placeholder="Alergi makanan / sudah vaksin rabies"
                      rows="3"
                      value={petForm.medical_history}
                      onChange={(e) => setPetForm({ ...petForm, medical_history: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-premium">
                      {editingPetId ? 'Simpan Perubahan' : 'Daftarkan Hewan'}
                    </button>
                    {editingPetId && (
                      <button type="button" className="btn-secondary" onClick={resetPetForm}>
                        Batal Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="card-premium">
                <div className="card-header-premium">
                  <h4>{isAdmin ? 'Daftar Seluruh Hewan Terdaftar' : 'Hewan Peliharaan Saya'}</h4>
                </div>
                {petsLoading ? (
                  <p>Memuat data hewan...</p>
                ) : (isAdmin ? pets : myPets).length === 0 ? (
                  <p style={{ fontStyle: 'italic', opacity: 0.7 }}>Belum ada hewan terdaftar di sistem.</p>
                ) : (
                  <div className="table-container">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Nama</th>
                          <th>Spesies/Ras</th>
                          <th>Umur</th>
                          <th>Kelamin</th>
                          {isAdmin && <th>Pemilik</th>}
                          <th>Riwayat Medis</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(isAdmin ? pets : myPets).map((p) => (
                          <tr key={p.id}>
                            <td><strong>{p.name}</strong></td>
                            <td>{p.species} ({p.breed || '-'})</td>
                            <td>{p.age} Tahun</td>
                            <td>{p.gender}</td>
                            {isAdmin && <td>{getUserName(p.user_id)}</td>}
                            <td>{p.medical_history || '-'}</td>
                            <td>
                              <button onClick={() => startEditPet(p)} className="btn-edit-sm">Edit</button>
                              <button onClick={() => { if (confirm('Yakin ingin menghapus?')) hapusPet(p.id); }} className="btn-danger-sm">Hapus</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* C. MASTER DATA - LAYANAN PAGE */}
          {activePage === 'master-layanan' && (
            <div>
              {/* Admins get CRUD controls, Users get a premium Read-Only Catalog */}
              {isAdmin ? (
                <div>
                  <div className="card-premium">
                    <div className="card-header-premium">
                      <h4>{editingServiceId ? '📝 Edit Layanan' : '➕ Tambah Layanan Baru'}</h4>
                    </div>
                    <form onSubmit={handleServiceSubmit}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Nama Layanan</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            placeholder="Grooming Kucing Standard"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Kategori Layanan</label>
                          <select
                            className="form-control"
                            value={serviceForm.category}
                            onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                          >
                            <option value="Grooming">Grooming (Perawatan Tubuh)</option>
                            <option value="Klinik">Klinik (Kesehatan Medis)</option>
                            <option value="Boarding">Boarding (Penitipan)</option>
                            <option value="Konsultasi">Konsultasi Dokter</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Harga (Rupiah)</label>
                          <input
                            type="number"
                            className="form-control"
                            required
                            placeholder="75000"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Durasi Perawatan (Menit)</label>
                          <input
                            type="number"
                            className="form-control"
                            required
                            placeholder="45"
                            value={serviceForm.duration_minutes}
                            onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group mb-4">
                        <label>Deskripsi Layanan</label>
                        <textarea
                          className="form-control"
                          placeholder="Deskripsi pengerjaan layanan"
                          rows="3"
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-premium">
                          {editingServiceId ? 'Simpan Perubahan' : 'Tambah Layanan'}
                        </button>
                        {editingServiceId && (
                          <button type="button" className="btn-secondary" onClick={resetServiceForm}>
                            Batal Edit
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="card-premium">
                    <div className="card-header-premium">
                      <h4>Daftar Layanan Sistem</h4>
                    </div>
                    {servicesLoading ? (
                      <p>Memuat data layanan...</p>
                    ) : (
                      <div className="table-container">
                        <table className="premium-table">
                          <thead>
                            <tr>
                              <th>Layanan</th>
                              <th>Kategori</th>
                              <th>Durasi</th>
                              <th>Harga</th>
                              <th>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {services.map((s) => (
                              <tr key={s.id}>
                                <td><strong>{s.name}</strong></td>
                                <td><span className="badge-status completed">{s.category}</span></td>
                                <td>🕒 {s.duration_minutes} Menit</td>
                                <td>Rp {Number(s.price).toLocaleString('id-ID')}</td>
                                <td>
                                  <button onClick={() => startEditService(s)} className="btn-edit-sm">Edit</button>
                                  <button onClick={() => { if (confirm('Yakin?')) hapusService(s.id); }} className="btn-danger-sm">Hapus</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* User Read-Only Grid Catalog */
                <div>
                  <div className="card-premium">
                    <h4>✂️ Katalog Layanan Perawatan PetCare</h4>
                    <p style={{ opacity: 0.7, marginTop: '4px' }}>Silakan pilih salah satu layanan kami yang sesuai untuk hewan kesayangan Anda.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {services.map((s) => (
                      <div key={s.id} className="card-premium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary-light)' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span className="badge-status completed" style={{ fontSize: '10px' }}>{s.category}</span>
                            <span style={{ fontSize: '12px', opacity: 0.6 }}>🕒 {s.duration_minutes} Mins</span>
                          </div>
                          <h3 style={{ fontSize: '18px', color: 'var(--secondary)', marginBottom: '8px' }}>{s.name}</h3>
                          <p style={{ fontSize: '13px', opacity: 0.7, color: 'var(--text-muted)', marginBottom: '16px' }}>{s.description || 'Tidak ada deskripsi pengerjaan.'}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-border)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>
                            Rp {Number(s.price).toLocaleString('id-ID')}
                          </span>
                          <button className="btn-premium" onClick={() => {
                            setReservationForm(prev => ({ ...prev, service_id: s.id, price: s.price }));
                            setActivePage('reservasi-buat');
                          }} style={{ padding: '6px 12px', fontSize: '12px' }}>
                            Pesan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* D. MASTER DATA - USER PAGE (Admin Only) */}
          {activePage === 'master-user' && isAdmin && (
            <div className="card-premium">
              <div className="card-header-premium">
                <h4>Daftar Seluruh Pengguna (PetOwners & Admin)</h4>
              </div>
              {usersLoading ? (
                <p>Memuat data pengguna...</p>
              ) : (
                <div className="table-container">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nama Lengkap</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge-status ${u.email.includes('admin') || u.id === 99 || u.email === 'test@example.com' ? 'completed' : 'pending'}`}>
                              {u.email.includes('admin') || u.id === 99 || u.email === 'test@example.com' ? 'Admin' : 'Owner'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => { if (confirm('Yakin ingin menghapus user ini?')) hapusUser(u.id); }}
                              className="btn-danger-sm"
                              disabled={u.id === currentUser.id}
                              style={{ opacity: u.id === currentUser.id ? 0.5 : 1 }}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* E. RESERVASI - BUAT RESERVASI PAGE */}
          {activePage === 'reservasi-buat' && (
            <div className="card-premium">
              <div className="card-header-premium">
                <h4>📅 Buat Reservasi Perawatan Online</h4>
              </div>
              <form onSubmit={handleReservationSubmit}>
                <div className="form-grid">
                  {isAdmin ? (
                    <div className="form-group">
                      <label>Pilih Pemilik (User)</label>
                      <select
                        className="form-control"
                        required
                        value={reservationForm.user_id}
                        onChange={(e) => setReservationForm({ ...reservationForm, user_id: e.target.value, pet_id: '' })}
                      >
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Pemilik (User)</label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        style={{ backgroundColor: '#f1f5f9' }}
                        value={currentUser.name}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Pilih Hewan Peliharaan</label>
                    <select
                      className="form-control"
                      required
                      value={reservationForm.pet_id}
                      onChange={(e) => setReservationForm({ ...reservationForm, pet_id: e.target.value })}
                    >
                      {filteredPetsForReservation.length === 0 ? (
                        <option value="">-- Tidak ada hewan terdaftar --</option>
                      ) : (
                        filteredPetsForReservation.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                        ))
                      )}
                    </select>
                    {filteredPetsForReservation.length === 0 && (
                      <span className="text-danger" style={{ display: 'block', marginTop: '4px' }}>
                        Daftarkan hewan peliharaan Anda terlebih dahulu di menu <strong>Hewan Saya</strong>!
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Pilih Layanan</label>
                    <select
                      className="form-control"
                      required
                      value={reservationForm.service_id}
                      onChange={(e) => handleServiceChangeInReservation(e.target.value)}
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Rp {Number(s.price).toLocaleString('id-ID')})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tanggal Booking</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={reservationForm.reservation_date}
                      onChange={(e) => setReservationForm({ ...reservationForm, reservation_date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Jam Booking</label>
                    <input
                      type="time"
                      className="form-control"
                      required
                      value={reservationForm.reservation_time}
                      onChange={(e) => setReservationForm({ ...reservationForm, reservation_time: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Biaya Layanan (Rp)</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold', color: 'var(--primary)' }}
                      value={reservationForm.price ? `Rp ${Number(reservationForm.price).toLocaleString('id-ID')}` : ''}
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label>Catatan Tambahan (Keluhan/Instruksi)</label>
                  <textarea
                    className="form-control"
                    placeholder="Contoh: Tolong potong kuku tipis saja, hewan agak agresif..."
                    rows="3"
                    value={reservationForm.notes}
                    onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-premium" style={{ padding: '12px 24px' }}>
                  Konfirmasi Booking Reservasi
                </button>
              </form>
            </div>
          )}

          {/* F. RESERVASI - JADWAL RESERVASI PAGE */}
          {activePage === 'reservasi-jadwal' && (
            <div className="card-premium">
              <div className="card-header-premium">
                <h4>⏰ {isAdmin ? 'Jadwal Reservasi Sistem' : 'Jadwal Booking Saya'}</h4>
              </div>
              {reservationsLoading ? (
                <p>Memuat jadwal reservasi...</p>
              ) : (isAdmin ? reservations : myReservations).filter(r => r.status === 'Pending').length === 0 ? (
                <p style={{ fontStyle: 'italic', opacity: 0.7 }}>Tidak ada reservasi pending/aktif saat ini.</p>
              ) : (
                <div className="table-container">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Pemilik</th>}
                        <th>Hewan</th>
                        <th>Layanan</th>
                        <th>Waktu Reservasi</th>
                        <th>Biaya</th>
                        <th>Keterangan</th>
                        <th>Status</th>
                        {isAdmin && <th>Ubah Status</th>}
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isAdmin ? reservations : myReservations).filter(r => r.status === 'Pending').map((r) => (
                        <tr key={r.id}>
                          {isAdmin && <td>{getUserName(r.user_id)}</td>}
                          <td>{getPetName(r.pet_id)}</td>
                          <td>{getServiceName(r.service_id)}</td>
                          <td>
                            <strong>{new Date(r.reservation_date).toLocaleDateString('id-ID')}</strong>
                            <br />
                            🕒 {r.reservation_time.substring(0, 5)} WIB
                          </td>
                          <td>Rp {Number(r.price).toLocaleString('id-ID')}</td>
                          <td>{r.notes || '-'}</td>
                          <td>
                            <span className="badge-status pending">{r.status}</span>
                          </td>
                          {isAdmin && (
                            <td>
                              <select
                                className="form-control"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                value={r.status}
                                onChange={(e) => updateStatusReservasi(r.id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Selesai</option>
                                <option value="Cancelled">Batal</option>
                              </select>
                            </td>
                          )}
                          <td>
                            <button onClick={() => { if (confirm('Batalkan reservasi?')) batalReservasi(r.id); }} className="btn-danger-sm">
                              Batal
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* G. RESERVASI - RIWAYAT RESERVASI PAGE */}
          {activePage === 'reservasi-riwayat' && (
            <div className="card-premium">
              <div className="card-header-premium">
                <h4>📜 {isAdmin ? 'Riwayat Selesai & Pembatalan Sistem' : 'Riwayat Booking Perawatan Saya'}</h4>
              </div>
              {reservationsLoading ? (
                <p>Memuat riwayat reservasi...</p>
              ) : (isAdmin ? reservations : myReservations).filter(r => r.status !== 'Pending').length === 0 ? (
                <p style={{ fontStyle: 'italic', opacity: 0.7 }}>Belum ada riwayat pengerjaan perawatan.</p>
              ) : (
                <div className="table-container">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Pemilik</th>}
                        <th>Hewan</th>
                        <th>Layanan</th>
                        <th>Tanggal Booking</th>
                        <th>Biaya</th>
                        <th>Keterangan</th>
                        <th>Status Akhir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isAdmin ? reservations : myReservations).filter(r => r.status !== 'Pending').map((r) => (
                        <tr key={r.id}>
                          {isAdmin && <td>{getUserName(r.user_id)}</td>}
                          <td>{getPetName(r.pet_id)}</td>
                          <td>{getServiceName(r.service_id)}</td>
                          <td>{new Date(r.reservation_date).toLocaleDateString('id-ID')} ({r.reservation_time.substring(0, 5)})</td>
                          <td>Rp {Number(r.price).toLocaleString('id-ID')}</td>
                          <td>{r.notes || '-'}</td>
                          <td>
                            <span className={`badge-status ${r.status.toLowerCase()}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* H. LAPORAN - RESERVASI PAGE (Admin Only) */}
          {activePage === 'laporan-reservasi' && isAdmin && (
            <div className="card-premium">
              <div className="report-header">
                <div>
                  <h4>📊 Laporan Keuangan & Kegiatan Reservasi</h4>
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>Akumulasi omzet dan data reservasi keseluruhan.</p>
                </div>
                <button onClick={() => window.print()} className="btn-premium">
                  🖨️ Cetak Laporan
                </button>
              </div>

              <div className="report-summary-bar">
                <div className="report-summary-item">
                  <h6>Total Omzet Reservasi</h6>
                  <p>
                    Rp {reservations
                      .filter(r => r.status === 'Completed')
                      .reduce((acc, r) => acc + Number(r.price), 0)
                      .toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="report-summary-item">
                  <h6>Reservasi Selesai</h6>
                  <p>{reservations.filter(r => r.status === 'Completed').length} Transaksi</p>
                </div>
                <div className="report-summary-item">
                  <h6>Reservasi Dibatalkan</h6>
                  <p>{reservations.filter(r => r.status === 'Cancelled').length} Transaksi</p>
                </div>
              </div>

              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Pemilik</th>
                      <th>Hewan</th>
                      <th>Layanan</th>
                      <th>Tanggal</th>
                      <th>Harga</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{getUserName(r.user_id)}</td>
                        <td>{getPetName(r.pet_id)}</td>
                        <td>{getServiceName(r.service_id)}</td>
                        <td>{new Date(r.reservation_date).toLocaleDateString('id-ID')}</td>
                        <td>Rp {Number(r.price).toLocaleString('id-ID')}</td>
                        <td>
                          <span className={`badge-status ${r.status.toLowerCase()}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* I. LAPORAN - HEWAN PAGE (Admin Only) */}
          {activePage === 'laporan-hewan' && isAdmin && (
            <div className="card-premium">
              <div className="report-header">
                <div>
                  <h4>📊 Laporan Statistik Hewan Peliharaan</h4>
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>Rangkuman demografi hewan terdaftar.</p>
                </div>
                <button onClick={() => window.print()} className="btn-premium">
                  🖨️ Cetak Laporan
                </button>
              </div>

              <div className="report-summary-bar">
                <div className="report-summary-item">
                  <h6>Total Kucing</h6>
                  <p>{pets.filter(p => p.species === 'Kucing').length} Ekor</p>
                </div>
                <div className="report-summary-item">
                  <h6>Total Anjing</h6>
                  <p>{pets.filter(p => p.species === 'Anjing').length} Ekor</p>
                </div>
                <div className="report-summary-item">
                  <h6>Total Kelinci</h6>
                  <p>{pets.filter(p => p.species === 'Kelinci').length} Ekor</p>
                </div>
                <div className="report-summary-item">
                  <h6>Spesies Lainnya</h6>
                  <p>{pets.filter(p => !['Kucing', 'Anjing', 'Kelinci'].includes(p.species)).length} Ekor</p>
                </div>
              </div>

              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Nama Hewan</th>
                      <th>Pemilik</th>
                      <th>Spesies</th>
                      <th>Ras (Breed)</th>
                      <th>Jenis Kelamin</th>
                      <th>Umur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{getUserName(p.user_id)}</td>
                        <td>{p.species}</td>
                        <td>{p.breed || '-'}</td>
                        <td>{p.gender}</td>
                        <td>{p.age} Tahun</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* J. LAPORAN - LAYANAN PAGE (Admin Only) */}
          {activePage === 'laporan-layanan' && isAdmin && (
            <div className="card-premium">
              <div className="report-header">
                <div>
                  <h4>📊 Laporan Katalog & Statistik Layanan Klinik</h4>
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>Rincian harga dan durasi penanganan medis/grooming.</p>
                </div>
                <button onClick={() => window.print()} className="btn-premium">
                  🖨️ Cetak Laporan
                </button>
              </div>

              <div className="report-summary-bar">
                <div className="report-summary-item">
                  <h6>Rata-rata Harga Layanan</h6>
                  <p>
                    Rp {services.length === 0 ? '0' : Math.round(
                      services.reduce((acc, s) => acc + Number(s.price), 0) / services.length
                    ).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="report-summary-item">
                  <h6>Layanan Termahal</h6>
                  <p>
                    Rp {services.length === 0 ? '0' : Math.max(
                      ...services.map(s => Number(s.price))
                    ).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="report-summary-item">
                  <h6>Total Macam Layanan</h6>
                  <p>{services.length} Layanan</p>
                </div>
              </div>

              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Nama Layanan</th>
                      <th>Kategori</th>
                      <th>Durasi (Menit)</th>
                      <th>Tarif Layanan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td><span className="badge-status completed">{s.category}</span></td>
                        <td>{s.duration_minutes} Menit</td>
                        <td><strong>Rp {Number(s.price).toLocaleString('id-ID')}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* K. PROFILE PAGE */}
          {activePage === 'profile' && (
            <div className="card-premium">
              <div className="card-header-premium">
                <h4>👤 Detail Profile Akun Anda</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                <div className="form-group">
                  <label>Nama Pengguna</label>
                  <input type="text" className="form-control" readOnly value={currentUser.name} style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label>Alamat Email</label>
                  <input type="email" className="form-control" readOnly value={currentUser.email} style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label>ID Sistem</label>
                  <input type="text" className="form-control" readOnly value={`PetCare #${currentUser.id}`} style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label>Role Hak Akses</label>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    {isAdmin ? '🛡️ Administrator' : '👤 Pemilik Hewan (Pet Owner)'}
                  </div>
                </div>
                <div className="form-group">
                  <label>Status Akun</label>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>🟢 Aktif (Connected)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;