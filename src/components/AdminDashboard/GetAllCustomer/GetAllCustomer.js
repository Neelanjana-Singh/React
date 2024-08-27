import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '../../../SharedComponents/sharedComponents/Table/Table'
import Login from '../../Login/Login';
import { getAllCustomers, getCustomerById, getCustomersByFirstName, getCustomersByLastName, getActiveCustomers, getInactiveCustomers, verifyAdminAccess } from '../../../services/apiService';
import './GetAllCustomer.css';

const GetAllCustomer = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [use, SetUse] = useState('');
    const [usevalue, SetUseValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = async () => {
            const isAdminResult = await verifyAdminAccess(setIsAdmin);
            if (!isAdminResult) {
                navigate("/login");
            }
        };

        checkAdminStatus();
    }, [navigate]);

    useEffect(() => {
        if (isAdmin) {
            fetchCustomers();
        }
    }, [isAdmin, searchType, searchValue, pageSize, currentPage]);

    const fetchCustomers = async () => {
        const token = localStorage.getItem("AuthToken");

        if (!token) {
            toast.error("No token found. Please log in.");
            return;
        }

        try {
            let response;

            switch (searchType) {
                case 'id':
                    response = await getCustomerById(token, searchValue);
                    setCustomers([response]);
                    setTotalPages(1);
                    break;
                case 'firstName':
                    response = await getCustomersByFirstName(token, searchValue, currentPage, pageSize);
                    setCustomers(response.content || []);
                    setTotalPages(response.totalPages || 0);
                    break;
                case 'lastName':
                    response = await getCustomersByLastName(token, searchValue, currentPage, pageSize);
                    setCustomers(response.content || []);
                    setTotalPages(response.totalPages || 0);
                    break;
                case 'active':
                    response = await getActiveCustomers(token, currentPage, pageSize);
                    setCustomers(response.content || []);
                    setTotalPages(response.totalPages || 0);
                    break;
                case 'inactive':
                    response = await getInactiveCustomers(token, currentPage, pageSize);
                    setCustomers(response.content || []);
                    setTotalPages(response.totalPages || 0);
                    break;
                default:
                    response = await getAllCustomers(token, currentPage, pageSize);
                    setCustomers(response.content || []);
                    setTotalPages(response.totalPages || 0);
                    break;
            }

            setError(null);
            setShouldFetch(false);
        } catch (error) {
            console.error("Error fetching customers:", error.response?.data || error.message);
            toast.error("Failed to fetch customers. Please try again.");
        }
    };

    const handleUpdateClick = (customerId) => {
        navigate(`/update-customer/${customerId}`);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setShouldFetch(true);
        setSearchType(use);
        setSearchValue(usevalue);
    };

    const handleReset = () => {
        setSearchType('');
        setSearchValue('');
        SetUse('');
        SetUseValue('');
        setCurrentPage(0);
        setShouldFetch(true);
    };

    const handleLogout = () => {
       // localStorage.removeItem('AuthToken'); // Clear the auth token
        navigate('/admin-dashboard'); // Redirect to the admin dashboard
    };

    if (!isAdmin) {
        return <Login />;
    }

    return (
        <div>
            <div className="header">
                <button onClick={handleLogout} className="btn btn-logout">Go Back</button>
            </div>
            <h1>Get All Customers</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div style={{ marginBottom: '10px' }}>
                <label>
                    Search By:
                    <select value={use} onChange={(e) => SetUse(e.target.value)} style={{ marginLeft: '5px' }}>
                        <option value="">Select</option>
                        <option value="id">ID</option>
                        <option value="firstName">First Name</option>
                        <option value="lastName">Last Name</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </label>
                <input
                    type="text"
                    value={usevalue}
                    onChange={(e) => SetUseValue(e.target.value)}
                    placeholder="Enter search value"
                    style={{ marginLeft: '10px' }}
                />
                <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>
                <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
            </div>
            <Table
                customers={customers}
                onUpdateClick={handleUpdateClick}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                fetchCustomers={fetchCustomers} // Pass fetchCustomers to Table
            />
        </div>
    );
};

export default GetAllCustomer;

