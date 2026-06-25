import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function usePetController() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/pets`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((resData) => {
        setPets(resData.data || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pets:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const tambahPet = (petData) => {
    return fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal menambahkan data hewan.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchPets(); // reload list
        return resData;
      });
  };

  const editPet = (id, petData) => {
    return fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal memperbarui data hewan.');
        }
        return res.json();
      })
      .then((resData) => {
        fetchPets(); // reload list
        return resData;
      });
  };

  const hapusPet = (id) => {
    return fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal menghapus data hewan.');
        }
        return res.json();
      })
      .then((resData) => {
        setPets((prev) => prev.filter((p) => p.id !== id));
        return resData;
      });
  };

  return { pets, loading, error, tambahPet, editPet, hapusPet, refreshPets: fetchPets };
}
