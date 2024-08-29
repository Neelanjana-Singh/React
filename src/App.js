import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import './App.css';
//import GlobalToast from './utils/GlobalToast';
// import UserDashboard from './components/UserDashboard/UserDashboard';
// import AdminDashboard from './components/AdminDashboard/AdminDashboard';
// import GetAllCustomer from './components/AdminDashboard/GetAllCustomer/GetAllCustomer';
// import GetAllTransactions from './components/AdminDashboard/GetAllTransaction/GetAllTransaction';
//import GetAllBanks from './components/AdminDashboard/GetAllBank/GetAllBank';
//import Passbook from './components/UserDashboard/Passbook/Passbook';
//import GetAllAccounts from './components/AdminDashboard/getAllAccount/GetAllAccounts/GetAllAccounts';
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import UserDashboard from './components/UserDashboard/UserDashboard'
//import GetAllCustomer from './components/AdminDashboard/GetAllCustomers/GetAllCustomer';
//import GetAllCustomer from './components/AdminDashboard/GetAllCustomer/GetAllCustomer'
import Passbook from './components/UserDashboard/Passbook/Passbook'
import GetAllTransactions from './components/AdminDashboard/GetAllTransaction/GetAllTransaction'
import GetAllBanks from './components/AdminDashboard/GetAllBank/GetAllBank'
import GetAllAccounts from './components/AdminDashboard/getAllAccount/GetAllAccounts/GetAllAccounts';
import GetAllCustomer from './components/AdminDashboard/GetAllCustomer/GetAllCustomer';

function App() {
  return (
    <div className="App">
      {/* <GlobalToast/> */}
      <h1>Banking App</h1>
      <Routes>
       <Route path="/login" element={<Login />}/>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/get-all-transactions" element={<GetAllTransactions/>}/>
        <Route path="/get-all-transactions/:customerId" element={<Passbook />} /> 
        <Route path="/get-all-banks" element={<GetAllBanks/>} />
        <Route path="/get-all-accounts" element={<GetAllAccounts/>} />
        
        <Route path="/get-all-customers" element={<GetAllCustomer/>} />
      </Routes>
      
    </div>
  );
}

export default App;

