import axios from 'axios';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function Login() {
  const formRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameInput = formRef.current.querySelector("input[id='username']");
    const passwordInput = formRef.current.querySelector("input[id='password']");

    try {
      const response = await axios.post("http://localhost:8088/api/auth/login", {
        username: usernameInput.value,
        password: passwordInput.value,
      });
      console.log(response)
      const accessToken = response.data.accessToken;
      const role=response.data.role;
      localStorage.setItem("AuthToken", accessToken);
      localStorage.setItem("customerId", response.data.customerId);
     toast.success("Login successful");
       if(role==='ROLE_ADMIN'){
     navigate('/admin-dashboard')
      }
     
     if(role==='ROLE_CUSTOMER'){
      navigate('/user-dashboard')
      }
     
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input type="text" className="form-control" id="username" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" id="password" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;

