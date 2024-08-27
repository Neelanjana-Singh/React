// src/components/AdminDashboard/AddBankModal.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addBank } from '../../../services/apiService';
//import { addBank } from '../../services/apiService'; // Adjust path as necessary
import './AddBank.css'

const AddBankModal = ({ showModal, handleClose, fetchBanks }) => {
  const [fullName, setFullName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !abbreviation) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('AuthToken');
      await addBank(token, { fullName, abbreviation, isActive: true });
      toast.success('Bank added successfully');
      fetchBanks(); // Refresh the bank list
      handleClose();
    } catch (error) {
      toast.error('Failed to add bank');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Bank</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Abbreviation</label>
            <input
              type="text"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Bank'}
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBankModal;
