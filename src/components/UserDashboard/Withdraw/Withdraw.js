import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { withdrawFromAccount } from '../../../services/apiService';
import './Withdraw.css'; // Common CSS for both modals

const WithdrawModal = ({ showModal, handleClose, customerId, accounts, fetchCustomerData }) => {
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedAccount) {
      toast.error('Please select an account');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('AuthToken');
      await withdrawFromAccount(token, customerId, selectedAccount, amount);
      toast.success('Withdrawal successful');
      fetchCustomerData(); // Refresh customer data
      handleClose();
    } catch (error) {
      toast.error('Failed to withdraw money');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Withdraw Money</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.accountNumber} value={account.accountNumber}>
                  {account.accountNumber}
                </option>
              ))}
            </select>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Withdrawing...' : 'Withdraw'}
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
