import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import ModalDelete from './ModalDelete';
import PropTypes from 'prop-types';

export function ContactCard({ contact }) {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    navigate(`/add-contact/${contact.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/sorin/contacts/${contact.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar contacto');
      }

      dispatch({
        type: 'delete_contact',
        payload: contact.id
      });
      setShowDeleteModal(false);
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h5 className="card-title">{contact.name}</h5>
              <p className="card-text">
                <strong>Email:</strong> {contact.email}
              </p>
              <p className="card-text">
                <strong>Teléfono:</strong> {contact.phone || 'No disponible'}
              </p>
              <p className="card-text">
                <strong>Dirección:</strong> {contact.address || 'No disponible'}
              </p>
            </div>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={handleEdit}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalDelete
        show={showDeleteModal}
        contactName={contact.name}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={loading}
      />
    </>
  );
}

ContactCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
};
