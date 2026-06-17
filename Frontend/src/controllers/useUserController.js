import { useState, useEffect } from 'react';

// Ini adalah CONTROLLER kamu
export function useUserController() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logika untuk mengambil data (bisa disambungkan ke Backend nanti)
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // Kamu juga bisa tambah fungsi/logic lain di sini
  const hapusUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Return data dan fungsi yang dibutuhkan oleh Frontend (View)
  return { users, loading, hapusUser };
}