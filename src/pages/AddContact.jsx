import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

const API_URL = 'https://playground.4geeks.com/contact/agendas/sorin';

export function AddContact() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { dispatch, store } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (id) {
      const contact = store.contacts.find(c => c.id === parseInt(id));
      if (contact) {
        setFormData({
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          address: contact.address || ''
        });
      }
    }
  }, [id, store.contacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        const response = await fetch(
          `${API_URL}/contacts/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          }
        );

        if (!response.ok) {
          throw new Error('Error al actualizar contacto');
        }

        const updatedContact = await response.json();
        dispatch({
          type: 'update_contact',
          payload: updatedContact
        });
      } else {
        const response = await fetch(
          `${API_URL}/contacts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          }
        );

        if (!response.ok) {
          throw new Error('Error al crear contacto');
        }

        const newContact = await response.json();
        dispatch({
          type: 'add_contact',
          payload: newContact
        });
      }

      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      dispatch({
        type: 'set_error',
        payload: error.message
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="mb-4">
            {id ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre Completo *
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Teléfono
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Dirección
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
