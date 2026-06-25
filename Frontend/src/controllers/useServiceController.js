import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useServiceController() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/services`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((resData) => {
        // Backend returns services in resData.data or direct array
        setServices(resData.data || resData || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const tambahService = (serviceData) => {
    return fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal menambahkan layanan.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchServices();
        return resData;
      });
  };

  const editService = (id, serviceData) => {
    return fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal memperbarui layanan.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchServices();
        return resData;
      });
  };

  const hapusService = (id) => {
    return fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal menghapus layanan.');
        }
        return res.json();
      })
      .then((resData) => {
        setServices((prev) => prev.filter((s) => s.id !== id));
        return resData;
      });
  };

  return {
    services,
    loading,
    error,
    tambahService,
    editService,
    hapusService,
    refreshServices: fetchServices
  };
}
