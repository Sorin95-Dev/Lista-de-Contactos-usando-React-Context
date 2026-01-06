import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { ContactCard } from '../components/ContactCard';

const API_URL = 'https://playground.4geeks.com/contact/agendas/sorin';

export function Contact() {
  const navigate = useNavigate();
  const { dispatch, store } = useGlobalReducer();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      fetchContacts();
    }
  }, []);

  const fetchContacts = async () => {
    dispatch({ type: 'set_loading', payload: true });
    try {
      const response = await fetch(`${API_URL}/contacts`);
      if (!response.ok) {
        throw new Error('Error al cargar contactos');
      }
      const data = await response.json();
      dispatch({
        type: 'set_contacts',
        payload: data.contacts || []
      });
    } catch (error) {
      dispatch({
        type: 'set_error',
        payload: error.message
      });
    }
  };

  const handleAddContact = () => {
    navigate('/add-contact');
  };

  if (store.loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (store.error) {
    return (
      <div className="alert alert-danger" role="alert">
        {store.error}
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={fetchContacts}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Contactos</h1>
        <button
          className="btn btn-primary"
          onClick={handleAddContact}
        >
          + Agregar Contacto
        </button>
      </div>

      {store.message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {store.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch({ type: 'clear_message' })}
          ></button>
        </div>
      )}

      {store.contacts.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <h5>No hay contactos</h5>
          <p>Comienza agregando tu primer contacto</p>
          <button
            className="btn btn-primary"
            onClick={handleAddContact}
          >
            Crear Contacto
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {store.contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
