import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useUserController() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/users`)
      .then((res) => res.json())
      .then((resData) => {
        setUsers(resData.data || []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchUsers(); }, []);

  const hapusUser = (id) => {
    fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE' })
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      });
  };

  return { users, loading, error, hapusUser, refreshUsers: fetchUsers };
}
