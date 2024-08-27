import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyAdminAccess } from '../../services/apiService'; // Adjust the path as necessary
//import AddBankModal from './AddBankModal'; // Import AddBankModal component
import './AdminDashboard.css';
import AddBankModal from './AddBank/AddBank';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdminResult = await verifyAdminAccess(setIsAdmin);
      if (!isAdminResult) {
        navigate('/login');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const cards = [
    { title: 'Get All Customers', description: 'View and manage all customers', route: '/get-all-customers' },
    { title: 'Get All Transactions', description: 'View and manage all transactions', route: '/get-all-transactions' },
    { title: 'Get All Banks', description: 'View and manage all banks', route: '/get-all-banks' },
    { title: 'Get All Accounts', description: 'View and manage all accounts', route: '/get-all-accounts' },
    { title: 'Add Bank', description: 'Add a new bank', onClick: () => setShowAddBankModal(true) }, // Updated to handle modal
    { title: 'Add Customer', description: 'Add a new customer', route: '/add-customer' }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem('AuthToken');
    navigate('/login');
  };

  // If not an admin, show nothing
  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} className="btn-logout">Logout</button>
      <div className="dashboard">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card"
            onClick={() => card.route ? handleCardClick(card.route) : card.onClick()}
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
      <AddBankModal
        showModal={showAddBankModal}
        handleClose={() => setShowAddBankModal(false)}
        fetchBanks={() => {}}
      />
    </div>
  );
};

export default AdminDashboard;
