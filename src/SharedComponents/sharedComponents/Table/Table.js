import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Pagination from '../Pagination/Pagination';
import PageSize from '../Pagination/PageSize';
import './Table.css';
import { updateCustomer, getAccountsByCustomerId, deactivateCustomerAndAccounts, createAccount } from '../../../services/apiService';

const Table = ({ customers, currentPage, pageSize, totalPages, setCurrentPage, setPageSize, fetchCustomers }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false); // Added
  const [editedCustomer, setEditedCustomer] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [newAccount, setNewAccount] = useState({ balance: '', bankId: '' }); // Added

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedCustomer((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("AuthToken");
      if (!token) {
        throw new Error('No token found');
      }

      await updateCustomer(token, editCustomerId, editedCustomer);
      setShowModal(false);
      setEditCustomerId(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditCustomerId(null);
    setShowAccountModal(false);
    setShowCreateAccountModal(false); // Added
  };

  const handleEditClick = (customer) => {
    setEditedCustomer(customer);
    setEditCustomerId(customer.customerId);
    setShowModal(true);
  };

  const handleViewAccounts = async (customerId) => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await getAccountsByCustomerId(token, customerId, 0, 5);
      setAccounts(response.content || []);
      setSelectedCustomerId(customerId);
      setShowAccountModal(true);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleDeactivate = async (customerId) => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      throw new Error('No token found');
    }

    try {
      await deactivateCustomerAndAccounts(token, customerId);
      fetchCustomers();
    } catch (error) {
      console.error('Error deactivating customer and accounts:', error);
    }
  };

  const handleCreateAccount = async () => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      throw new Error('No token found');
    }

    try {
      await createAccount(token, { ...newAccount, customerId: selectedCustomerId });
      setShowCreateAccountModal(false);
      setNewAccount({ balance: '', bankId: '' });
      handleViewAccounts(selectedCustomerId); // Refresh account list
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleCreateAccountChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <table border="1" cellPadding="5" className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Total Balance</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Account Details</th>
            <th>Create Account</th> {/* Added */}
            <th>Deactivate</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No data available</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.totalBalance}</td>
                <td>
                  <span className={`badge ${customer.active ? 'bg-success' : 'bg-secondary'}`}>
                    {customer.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditClick(customer)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => handleViewAccounts(customer.customerId)}
                  >
                    View Accounts
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-success" // Changed to green
                    onClick={() => {
                      setSelectedCustomerId(customer.customerId);
                      setShowCreateAccountModal(true);
                    }}
                  >
                    Create Account
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeactivate(customer.customerId)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <PageSize pageSize={pageSize} onPageSizeChange={handlePageSizeChange} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal for editing customer */}
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editedCustomer.firstName || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editedCustomer.lastName || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formActive">
              <Form.Check
                type="checkbox"
                name="active"
                label="Active"
                checked={editedCustomer.active || false}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for viewing account details */}
      <Modal show={showAccountModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {accounts.length === 0 ? (
            <p>No accounts found for this customer.</p>
          ) : (
            <table border="1" cellPadding="5" className="table">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Bank ID</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.accountNumber}>
                    <td>{account.accountNumber}</td>
                    <td>{account.bankId}</td>
                    <td>{account.balance}</td>
                    <td>
                      <span className={`badge ${account.active ? 'bg-success' : 'bg-secondary'}`}>
                        {account.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for creating a new account */}
      <Modal show={showCreateAccountModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBalance">
              <Form.Label>Balance</Form.Label>
              <Form.Control
                type="number"
                name="balance"
                value={newAccount.balance || ''}
                onChange={handleCreateAccountChange}
              />
            </Form.Group>
            <Form.Group controlId="formBankId">
              <Form.Label>Bank ID</Form.Label>
              <Form.Control
                type="text"
                name="bankId"
                value={newAccount.bankId || ''}
                onChange={handleCreateAccountChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateAccount}>
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Table;
