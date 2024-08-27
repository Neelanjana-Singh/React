// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { getCustomerById, getCustomerDetails, getTotalBalance } from '../../services/apiService'; // Adjust paths as necessary
// //import './UserDashboard.css';

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [customer, setCustomer] = useState(null);
//   const [totalBalance, setTotalBalance] = useState(0);
//   const [customerId, setCustomerId] = useState(null);

//   // This useEffect is used to get the customerId from localStorage and set it in the state
//   useEffect(() => {
//     const id = localStorage.getItem("customerId");
//     setCustomerId(id);
//   }, []);

//   // This useEffect will only run when customerId is available
//   useEffect(() => {
//     if (customerId) {
//       fetchCustomerData();
//     }
    
//   }, [customerId]);


//   const fetchCustomerData = async () => {
//     try {
//       const token = localStorage.getItem('AuthToken');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const response = await getCustomerById(token, customerId);
//       console.log("response:", response);
//        setCustomer(response)
    
      
//     } catch (error) {
//       console.error('Failed to fetch customer data:', error);
//       toast.error('Failed to fetch customer data');
//       navigate('/login');
//     }
//   };

//   const cards = [
//     { title: 'Get All Transactions', description: 'View all transactions related to your account', route: `/get-all-transactions/${customerId}` },
//     { title: 'Withdraw', description: 'Withdraw money from your account', route: `/withdraw/${customerId}` },
//     { title: 'Deposit', description: 'Deposit money into your account', route: `/deposit/${customerId}` }
//   ];

//   const handleCardClick = (route) => {
//     navigate(route);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('AuthToken');
//     navigate('/login');
//   };

//   return (
//     <div>
//       <h1>User Dashboard</h1>
//       <button onClick={handleLogout} className="btn-logout">Logout</button>
//       <div className="user-info">
//         <h2>Customer ID: {customerId}</h2>
//         <h2>Name: {customer?.firstName} {customer?.lastName}</h2>
//         <h2>Total Balance: {customer?.totalBalance}</h2>
//       </div>
//       <div className="dashboard">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className="card"
//             onClick={() => handleCardClick(card.route)}
//           >
//             <h3>{card.title}</h3>
//             <p>{card.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomerById } from '../../services/apiService';
import './UserDashBoard.css';
import WithdrawModal from './Withdraw/Withdraw';
import DepositModal from './Deposit/Deposit';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("customerId");
    setCustomerId(id);
  }, []);

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
      console.log(response)
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
      toast.error('Failed to fetch customer data');
      navigate('/login');
    }
  };

  const cards = [
    { title: 'Get All Transactions', description: 'View all transactions related to your account', route: `/get-all-transactions/${customerId}` },
    { title: 'Withdraw', description: 'Withdraw money from your account', onClick: () => setShowWithdrawModal(true) },
    { title: 'Deposit', description: 'Deposit money into your account', onClick: () => setShowDepositModal(true) }
  ];

  const handleCardClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('AuthToken');
    navigate('/login');
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={handleLogout} className="btn-logout">Logout</button>
      <div className="user-info">
        <h2>Customer ID: {customerId}</h2>
        <h2>Name: {customer?.firstName} {customer?.lastName}</h2>
        <h2>Total Balance: {customer?.totalBalance}</h2>
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
        accounts={customer?.accounts} // Assuming you have accountId in the customer data
        fetchCustomerData={fetchCustomerData}
      />
      <DepositModal
        showModal={showDepositModal}
        handleClose={() => setShowDepositModal(false)}
        customerId={customerId}
        accountId={customer?.accountId} // Assuming you have accountId in the customer data
        fetchCustomerData={fetchCustomerData}
      />
    </div>
  );
};

export default UserDashboard;
