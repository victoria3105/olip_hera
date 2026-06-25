import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useReservationController() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/reservations`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((resData) => {
        setReservations(resData.data || resData || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reservations:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const buatReservasi = (reservationData) => {
    return fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal membuat reservasi.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchReservations();
        return resData;
      });
  };

  const batalReservasi = (id) => {
    return fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
      method: 'PUT',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal membatalkan reservasi.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchReservations();
        return resData;
      });
  };

  const updateStatusReservasi = (id, status) => {
    return fetch(`${API_BASE_URL}/admin/reservations/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal memperbarui status reservasi.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchReservations();
        return resData;
      });
  };

  return {
    reservations,
    loading,
    error,
    buatReservasi,
    batalReservasi,
    updateStatusReservasi,
    refreshReservations: fetchReservations
  };
}
