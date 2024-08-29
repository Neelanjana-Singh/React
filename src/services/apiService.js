
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import { handleApiError } from '../utils/error/Error';
const API_BASE_URL = 'http://localhost:8088/api';



export const registerUser = async (formData) => {
    try {
        await axios.post(`${API_BASE_URL}/auth/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.success("Registration successful");
    } catch (error) {
        console.error("Error registering:", error);
        toast.error("Failed to register. Please check your details.");
        throw error; 
    }
};


export const getAllCustomers = async (token, page, size) => {
    console.log("helllooo")
    try {
        const response = await axios.get(`${API_BASE_URL}/customers/all`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getCustomerById = async (customerId) => {
    const token = localStorage.getItem('AuthToken');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        console.log("Fetching customer by ID...");
        const response = await axios.get(`http://localhost:8088/api/customers/${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching customer by ID:", error.message);
        throw error; // Re-throwing the error to be handled by the caller
    }
};


export const getCustomersByFirstName = async (token, firstName, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customers/firstName/${firstName}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCustomersByLastName = async (token, lastName, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customers/lastName/${lastName}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getActiveCustomers = async (token, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customers/active`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInactiveCustomers = async (token, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customers/inactive`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCustomer = async (token, customerId, customerData) => {
    try {
        await axios.put(`${API_BASE_URL}/accounts/customer/${customerId}`, customerData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error;
    }
};

export const getAccountsByCustomerId = async (token, customerId, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/accounts/customers/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deactivateCustomerAndAccounts = async (token, customerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/deactivateCustomerAndAccounts/${customerId}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to deactivate customer and accounts');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};



export const createAccount = async (token, accountData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/accounts`, accountData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

  


export const getAllTransactions = async (token, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transactions/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
        console.error('Error fetching transactions:', errorMessage);
        throw error;
    }
};

export const getTransactionById = async (token, transactionId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction by ID:', error);
        toast.error('Failed to fetch transaction by ID');
        throw error;
    }
};

export const getTransactionsByDateRange = async (token, startDate, endDate, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transactions/dates`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { startDate, endDate, page, size }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions by date range:', error);
        toast.error('Failed to fetch transactions by date range');
        throw error;
    }
};

export const getAllAccounts = async (token, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/accounts/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('Failed to fetch accounts');
        throw error;
    }
};




export const getAccountById = async (token, accountNumber) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/accounts/${accountNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching account by ID:', error);
        throw error;
    }
};

export const getActiveAccounts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/accounts/active`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { content: response.data };
    } catch (error) {
        console.error('Error fetching active accounts:', error);
        throw error;
    }
};

export const getInactiveAccounts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/accounts/inactive`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { content: response.data };
    } catch (error) {
        console.error('Error fetching inactive accounts:', error);
        throw error;
    }
};

export const getAllBanks = async (token, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/banks/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching banks:', error);
        throw error;
    }
};



export const getBankById = async (token, bankId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/banks/${bankId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bank by ID:', error);
        throw error;
    }
};

export const getBankByName = async (token, fullName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/banks/name/${fullName}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bank by name:', error);
        throw error;
    }
};

export const getBankByAbbreviation = async (token, abbreviation) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/banks/abbreviation/${abbreviation}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bank by abbreviation:', error);
        throw error;
    }
};


export const addBank = async (token, bankData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/banks`, bankData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding bank:', error);
        toast.error('Failed to add new bank');
        throw error;
    }
};

export const getCustomerDetails = async (token, customerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customer details:', error);
        throw error;
    }
};


export const getTotalBalance = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/accounts/total-balance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching total balance:', error);
        throw error;
    }
};

export const FetchTotalBalance = async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/balance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching total balance:', error);
      throw error;
    }
  };


  export const getTransactionsByCustomerId = async (customerId, page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/transactions`, {

        headers:{
            Authorization:`Bearer ${localStorage.getItem('AuthToken')}` 
         },
         params:{
            page ,
            size

         }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };



export const withdrawFromAccount = async (token, customerId, accountId, amount) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/customers/${customerId}/accounts/${accountId}/withdraw`,
            null,
            {
                params: { amount },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
        console.error('Error during withdrawal:', errorMessage);
        throw error;
    }
};

export const depositToAccount = async (token, customerId, accountId, amount) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/customers/${customerId}/accounts/${accountId}/deposit`,
        null,
        {
          params: { amount },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error during deposit:', error);
      toast.error('Failed to deposit to account');
      throw error;
    }
  };;


export const makeTransaction = async (token, customerId, senderAccountNumber, receiverAccountNumber, amount) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transactions`,
        {
          senderAccountNumber,
          receiverAccountNumber,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Transaction response:', response.data); // Log the successful response
      return response.data;
    } catch (error) {
      console.error('Transaction error:', error); // Log the error for debugging
      throw new Error(error.response?.data?.message || 'Transaction failed');
    }
  };

  
export const verifyAdminAccess = async (setIsAdmin) => {
    const token = localStorage.getItem('AuthToken');

    if (!token) {
        toast.error("Unauthorized access: Token missing");
        return false;
    }

    try {
        const response = await axios.post("http://localhost:8088/api/auth/verify/admin", null, {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                acesstoken: token
            }
        });

        if (response.data === true) {
            setIsAdmin(true);
          if (!localStorage.getItem('adminToastDisplayed')) {
                toast.success("You are an admin");
                localStorage.setItem('adminToastDisplayed', 'true');
            }
            return true;
        } else {
            setIsAdmin(false);
            Navigate('/login')
            toast.error("Unauthorized access: Not an admin");
            return false;
        }
    } catch (error) {
        setIsAdmin(false);
        console.error("Error verifying admin access:", error);
        toast.error("An error occurred while verifying admin access");
        return false;
    }
};

