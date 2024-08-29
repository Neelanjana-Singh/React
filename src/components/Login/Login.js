import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify
import './Login.css'; // Create a CSS file for custom styles
import RegisterModal from './Register';

function Login() {
  const formRef = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameInput = formRef.current.querySelector("input[id='username']");
    const passwordInput = formRef.current.querySelector("input[id='password']");

    const errors = {};
    if (!usernameInput.value) {
      errors.username = 'Username is required';
    }
    if (!passwordInput.value) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8088/api/auth/login", {
        username: usernameInput.value,
        password: passwordInput.value,
      });

      const { accessToken, role, customerId } = response.data;
      localStorage.setItem("AuthToken", accessToken);
      localStorage.setItem("customerId", customerId);

      
      toast.success("Login successful!");

      if (role === 'ROLE_ADMIN') {
        toast.info("You are an admin.");
        navigate('/admin-dashboard');
      } else if (role === 'ROLE_CUSTOMER') {
        toast.info("You are a user.");
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error("Error logging in:", error);
      
     
      if (error.response && error.response.status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form ref={formRef} onSubmit={handleSubmit}>
          {errors.form && <div className="error-message">{errors.form}</div>}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control" id="username" />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <button onClick={() => setModalIsOpen(true)} className="btn btn-secondary">Register</button>
      </div>
      <RegisterModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
      
    </div>
  );
}

export default Login;
