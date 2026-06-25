import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useDashboardController() {
  const [stats, setStats] = useState({ totalPets: 0, totalServices: 0, totalReservations: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/dashboard`)
      .then((res) => res.json())
      .then((resData) => {
        setStats(resData.data || resData);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, error, refreshStats: fetchStats };
}
