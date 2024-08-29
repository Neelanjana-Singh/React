import React, { useState } from 'react';
import Modal from 'react-modal';
import { registerUser } from '../../services/apiService';
import './Login.css';

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'ROLE_CUSTOMER',
    file1: null,
    file2: null
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const errors = {};
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      await registerUser(data);
      onClose(); // Close the modal on successful registration
    } catch (error) {
      console.error("Error registering user:", error);
      setErrors({ form: "Registration failed. Please try again." });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Register Modal"
    >
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {errors.form && <div className="error-message">{errors.form}</div>}
        <div className="mb-3">
          <label htmlFor="register-username" className="form-label">Username</label>
          <input type="text" className="form-control" name="username" id="register-username" value={formData.username} onChange={handleInputChange} />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="register-password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" id="register-password" value={formData.password} onChange={handleInputChange} />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="register-email" className="form-label">Email</label>
          <input type="email" className="form-control" name="email" id="register-email" value={formData.email} onChange={handleInputChange} />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="register-first-name" className="form-label">First Name</label>
          <input type="text" className="form-control" name="firstName" id="register-first-name" value={formData.firstName} onChange={handleInputChange} />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="register-last-name" className="form-label">Last Name</label>
          <input type="text" className="form-control" name="lastName" id="register-last-name" value={formData.lastName} onChange={handleInputChange} />
          {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select name="role" id="role" className="form-control" value={formData.role} onChange={handleInputChange}>
            <option value="ROLE_CUSTOMER">Customer</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="file1" className="form-label">File 1</label>
          <input type="file" className="form-control" name="file1" id="file1" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="file2" className="form-label">File 2</label>
          <input type="file" className="form-control" name="file2" id="file2" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
        <button onClick={onClose} className="btn btn-secondary">Close</button>
      </form>
    </Modal>
  );
};

export default RegisterModal;


