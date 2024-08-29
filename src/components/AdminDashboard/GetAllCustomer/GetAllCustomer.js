import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '../../../SharedComponents/Table/Table';
import Login from '../../Login/Login';
import { getAllCustomers, getCustomerById, getCustomersByFirstName, getCustomersByLastName, getActiveCustomers, getInactiveCustomers, verifyAdminAccess } from '../../../services/apiService';
import './GetAllCustomer.css';

const GetAllCustomer = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAdminStatus = async () => {
            const isAdminResult = await verifyAdminAccess(setIsAdmin);
            if (!isAdminResult) {
                navigate("/login");
            } else {
                setIsAdmin(true);
            }
        };

        checkAdminStatus();
    }, [navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
        const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
        const initialSearchType = queryParams.get("searchType") || "";
        const initialSearchValue = queryParams.get('searchValue') || '';
        
        setPageSize(initialPageSize);
        setSearchType(initialSearchType);
        setSearchValue(initialSearchValue);
        setInputValue(initialSearchValue);
        setCurrentPage(initialPageNumber);
    }, [location.search]);

    useEffect(() => {
        if (isAdmin) {
            fetchCustomers();
        }
    }, [isAdmin, searchType, searchValue, pageSize, currentPage]);

    const fetchCustomers = async () => {
        const token = localStorage.getItem("AuthToken");
    
        if (!token) {
            console.error("No token found");
            navigate("/login");
            return;
        }
    
        try {
            let response;
    
            switch (searchType) {
                case 'id':
                    response = await getCustomerById(token, searchValue);
                    if (response) setCustomers([response]);
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
    
            const queryParams = new URLSearchParams();
            queryParams.set("pageSize", pageSize);
            queryParams.set("pageNumber", currentPage);
            queryParams.set("searchType", searchType);
            queryParams.set("searchValue", searchValue);
            navigate({ search: queryParams.toString() }, { replace: true });
    
            setError(null);
        } catch (error) {
            console.error("Error fetching customers:", error.response?.data || error.message);
        }
    };
    
    const handleUpdateClick = (customerId) => {
        navigate(`/update-customer/${customerId}`);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setSearchValue(inputValue);
    };

    const handleReset = () => {
        setSearchType('');
        setSearchValue('');
        setInputValue('');
        setCurrentPage(0);
        fetchCustomers();
        const queryParams = new URLSearchParams();
        queryParams.set("pageSize", pageSize);
        queryParams.set("pageNumber", 0);
        queryParams.delete("searchType");
        queryParams.delete("searchValue");
        navigate({ search: queryParams.toString() }, { replace: true });
    };

    const handleGoBack = () => {
        navigate('/admin-dashboard');
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Get All Customers</h1>
                <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="search-bar">
                <label>
                    Search By:
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="">Select</option>
                        <option value="firstName">First Name</option>
                        <option value="lastName">Last Name</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter search value"
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <Table
                customers={customers}
                onUpdateClick={handleUpdateClick}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                fetchCustomers={fetchCustomers}
            />
        </div>
    );
};

export default GetAllCustomer;
