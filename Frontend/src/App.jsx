import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// 1. IMPORT CONTROLLER YANG SUDAH DIBUAT
import { useUserController } from './controllers/useUserController'

function App() {
  const [count, setCount] = useState(0)
  
  // 2. PANGGIL LOGIC DARI CONTROLLER DI SINI
  const { users, loading, hapusUser } = useUserController()

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      {/* 3. MASUKKAN BAGIAN CONTROLLER DAN DATA DI SINI */}
      <section id="frontend-controller" style={{ padding: '20px', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#646cff' }}>Daftar Pengguna (Frontend Controller)</h2>
        <p style={{ opacity: 0.7 }}>Data di bawah ini diatur sepenuhnya oleh Custom Hook sebagai Controller.</p>
        
        {loading ? (
          <h3>Sedang memuat data dari API...</h3>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {users.map((user) => (
              <li key={user.id} style={{ 
                background: '#1a1a1a', 
                padding: '10px 15px', 
                borderRadius: '8px', 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #333'
              }}>
                <span>
                  <strong>{user.name}</strong> – <span style={{ color: '#aaa' }}>{user.email}</span>
                </span>
                <button 
                  onClick={() => hapusUser(user.id)}
                  style={{ 
                    background: '#ff4d4d', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App