import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { getTransactionsByCustomerId } from '../../../services/apiService';
import './Passbook.css';

const Passbook = ({ customerId }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchTransactions();
  }, [page, size]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const storedCustomerId = localStorage.getItem('customerId'); // Use storedCustomerId instead
      const data = await getTransactionsByCustomerId(storedCustomerId, page, size);
      setTransactions(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
    setPage(0); // Reset to first page on size change
  };

  const handleBack = () => {
    navigate('/user-dashboard'); // Navigate to UserDashboard
  };

  const handleLogout = () => {
    localStorage.removeItem('AuthToken'); // Remove the token
    localStorage.removeItem('customerId'); // Optionally remove customerId as well
    navigate('/login'); // Navigate to login page
  };

  return (
    <div>
      <h2>Transactions</h2>
      <button onClick={handleBack}>Back to Dashboard</button>
      <button onClick={handleLogout}>Logout</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div>
            <label htmlFor="size">Rows per page: </label>
            <select id="size" value={size} onChange={handleSizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Amount</th>
                <th>Sender Account</th>
                <th>Receiver Account</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>{transaction.transactionId}</td>
                  <td>{new Date(transaction.transactionTimestamp).toLocaleString()}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.senderAccountNumber}</td>
                  <td>{transaction.receiverAccountNumber}</td>
                  <td>{transaction.active ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 0}>
              Previous
            </button>
            <span>{page + 1} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Passbook;
