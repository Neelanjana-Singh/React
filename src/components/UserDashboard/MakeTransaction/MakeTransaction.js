import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { makeTransaction } from '../../../services/apiService';
import './MakeTransaction.css'; // Common CSS for modals

const MakeTransactionModal = ({ showModal, handleClose, customerId, accounts, fetchCustomerData }) => {
  const [amount, setAmount] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!senderAccount) {
      toast.error('Please select a sender account');
      return;
    }

    if (!receiverAccount) {
      toast.error('Please select a receiver account');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('AuthToken');
      await makeTransaction(token, customerId, senderAccount, receiverAccount, amount);
      toast.success('Transaction successful');
      fetchCustomerData(); // Refresh customer data
      handleClose();
    } catch (error) {
      toast.error('Failed to make transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Make Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sender Account</label>
            <select value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} required>
              <option value="" disabled>Select sender account</option>
              {accounts.map((account) => (
                <option key={account.accountNumber} value={account.accountNumber}>
                  {account.accountNumber} - Balance: {account.balance}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Receiver Account</label>
            <input
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              placeholder="Enter receiver account number"
              required
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Make Transaction'}
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeTransactionModal;
