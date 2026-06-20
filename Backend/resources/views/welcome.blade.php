<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PatCare Dashboard</title>

    <style>
        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
            font-family:'Segoe UI',sans-serif;
        }

        body{
            background:linear-gradient(135deg,#eef7ff,#f0fff4);
        }

        .navbar{
            background:linear-gradient(90deg,#3b82f6,#10b981);
            color:white;
            padding:20px 50px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            box-shadow:0 4px 15px rgba(0,0,0,.15);
        }

        .logo{
            font-size:30px;
            font-weight:bold;
        }

        .pets-banner{
            text-align:center;
            font-size:80px;
            padding-top:30px;
        }

        .hero{
            text-align:center;
            padding:30px 20px 60px;
        }

        .hero h1{
            font-size:60px;
            background:linear-gradient(90deg,#2563eb,#10b981);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            margin-bottom:15px;
        }

        .hero p{
            font-size:18px;
            color:#475569;
            max-width:850px;
            margin:auto;
            line-height:1.8;
        }

        .stats{
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
            gap:20px;
            padding:0 60px 50px;
        }

        .stat-box{
            background:linear-gradient(135deg,#3b82f6,#10b981);
            color:white;
            text-align:center;
            padding:30px;
            border-radius:20px;
            box-shadow:0 10px 20px rgba(0,0,0,.15);
        }

        .stat-box h2{
            font-size:40px;
            margin-bottom:10px;
        }

        .cards{
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
            gap:25px;
            padding:20px 60px 60px;
        }

        .card{
            background:white;
            padding:30px;
            border-radius:18px;
            box-shadow:0 10px 25px rgba(0,0,0,.08);
            border-top:5px solid #10b981;
            transition:.3s;
        }

        .card:hover{
            transform:translateY(-8px);
            box-shadow:0 15px 35px rgba(0,0,0,.15);
        }

        .card h3{
            color:#2563eb;
            margin-bottom:15px;
            font-size:22px;
        }

        .card p{
            color:#555;
            line-height:1.7;
        }

        .tech-section{
            padding:20px 60px 60px;
        }

        .tech-box{
            background:white;
            padding:30px;
            border-radius:20px;
            box-shadow:0 10px 25px rgba(0,0,0,.08);
        }

        .tech-box h2{
            color:#2563eb;
            margin-bottom:20px;
        }

        .tech-list{
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
            gap:15px;
        }

        .tech-item{
            background:#f8fafc;
            padding:15px;
            border-radius:10px;
            border-left:5px solid #10b981;
        }

        footer{
            text-align:center;
            padding:25px;
            background:linear-gradient(90deg,#3b82f6,#10b981);
            color:white;
            font-size:15px;
        }
    </style>
</head>
<body>

    <div class="navbar">
        <div class="logo">🐾 PatCare</div>
        <div>Pet Care Reservation System</div>
    </div>

    <div class="pets-banner">
        🐶 🐱 🐰
    </div>

    <div class="hero">
        <h1>Welcome to PatCare</h1>

        <p>
            PatCare merupakan sistem reservasi layanan perawatan hewan peliharaan
            berbasis Laravel yang memudahkan pengguna dalam mengelola data hewan,
            memilih layanan, melakukan reservasi, serta memantau riwayat layanan
            secara cepat dan efisien.
        </p>
    </div>

    <div class="stats">

        <div class="stat-box">
            <h2>6</h2>
            <p>Modules</p>
        </div>

        <div class="stat-box">
            <h2>100%</h2>
            <p>REST API Ready</p>
        </div>

        <div class="stat-box">
            <h2>Laravel</h2>
            <p>Framework</p>
        </div>

        <div class="stat-box">
            <h2>CRUD</h2>
            <p>Implemented</p>
        </div>

    </div>

    <div class="cards">

        <div class="card">
            <h3>🔐 Authentication</h3>
            <p>
                Fitur registrasi, login, logout dan profile management untuk pengguna sistem.
            </p>
        </div>

        <div class="card">
            <h3>🐶 Pet Management</h3>
            <p>
                Mengelola data hewan peliharaan seperti nama, ras, usia, jenis kelamin,
                dan riwayat kesehatan.
            </p>
        </div>

        <div class="card">
            <h3>✂️ Service Management</h3>
            <p>
                Mengelola berbagai layanan seperti grooming, boarding,
                konsultasi kesehatan dan layanan lainnya.
            </p>
        </div>

        <div class="card">
            <h3>📅 Reservation</h3>
            <p>
                Membuat reservasi layanan untuk hewan peliharaan secara online.
            </p>
        </div>

        <div class="card">
            <h3>📜 Reservation History</h3>
            <p>
                Menyimpan histori perubahan status reservasi dan aktivitas pengguna.
            </p>
        </div>

        <div class="card">
            <h3>👨‍💼 Admin Management</h3>
            <p>
                Mengelola user, pet, layanan, serta memonitor seluruh reservasi.
            </p>
        </div>

    </div>

    <div class="tech-section">

        <div class="tech-box">

            <h2>🚀 Technologies Used</h2>

            <div class="tech-list">

                <div class="tech-item">
                    Laravel Framework
                </div>

                <div class="tech-item">
                    REST API Architecture
                </div>

                <div class="tech-item">
                    Service Layer Pattern
                </div>

                <div class="tech-item">
                    Dependency Injection
                </div>

                <div class="tech-item">
                    Interface Contracts
                </div>

                <div class="tech-item">
                    MySQL Database
                </div>

            </div>

        </div>

    </div>

    <footer>
        🐾 PatCare © 2026 | Kelompok 15 | Laravel Service Layer Architecture
    </footer>

</body>
</html>