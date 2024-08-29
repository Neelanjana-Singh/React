
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomerById } from '../../services/apiService';
import './UserDashBoard.css';
import WithdrawModal from './Withdraw/Withdraw';
import DepositModal from './Deposit/Deposit';
import MakeTransactionModal from './MakeTransaction/MakeTransaction';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showMakeTransactionModal, setShowMakeTransactionModal] = useState(false); 

  useEffect(() => {
    const id = localStorage.getItem("customerId");
    if (!id) {
      navigate('/login');
      return;
    }
    setCustomerId(id);
  }, [navigate]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem('AuthToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await getCustomerById(customerId);
      setCustomer(response);
      console.log(response);
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
      toast.error('Failed to fetch customer data');
      navigate('/login');
    }
  };

  const formatAccounts = () => {
    if (!customer?.accounts?.length) return 'No accounts available';
    return customer.accounts.map((account, index) => (
      <div key={index} className="account-details">
        <span><strong>Account Number {index + 1}:</strong> {account.accountNumber}</span>
        <span> - <strong>Balance:</strong> {account.balance}</span>
      </div>
    ));
  };

  const cards = [
    { title: 'Get All Transactions', description: 'View all transactions related to your account', route: `/get-all-transactions/${customerId}` },
    { title: 'Withdraw', description: 'Withdraw money from your account', onClick: () => setShowWithdrawModal(true) },
    { title: 'Deposit', description: 'Deposit money into your account', onClick: () => setShowDepositModal(true) },
    { title: 'Make New Transaction', description: 'Transfer money to another account', onClick: () => setShowMakeTransactionModal(true) }
  ];

  const handleCardClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('AuthToken');
    localStorage.removeItem('customerId');
    navigate('/login');
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={handleLogout} className="btn-logout">Logout</button>
      <div className="user-info">
        <h6>Customer ID: {customerId}</h6>
        <h6>Name: {customer?.firstName} {customer?.lastName}</h6>
        <h6>Total Balance: {customer?.totalBalance}</h6>
        <h6>Number of Accounts: {customer?.accounts?.length || 0}</h6>
        <div className="account-info">
          {formatAccounts()}
        </div>
      </div>
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
      <WithdrawModal
        showModal={showWithdrawModal}
        handleClose={() => setShowWithdrawModal(false)}
        customerId={customerId}
        accounts={customer?.accounts}
        fetchCustomerData={fetchCustomerData}
      />
      <DepositModal
        showModal={showDepositModal}
        handleClose={() => setShowDepositModal(false)}
        customerId={customerId}
        accounts={customer?.accounts}
        fetchCustomerData={fetchCustomerData}
      />
      <MakeTransactionModal
        showModal={showMakeTransactionModal}
        handleClose={() => setShowMakeTransactionModal(false)}
        customerId={customerId}
        accounts={customer?.accounts}
        fetchCustomerData={fetchCustomerData}
      />
    </div>
  );
};

export default UserDashboard;
