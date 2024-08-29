import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllAccounts, getAccountsByCustomerId, getAccountById, getActiveAccounts, getInactiveAccounts } from '../../../../services/apiService';
import './GetAllAccounts.css'; 


const GetAllAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [columns, setColumns] = useState([]); 
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLast, setIsLast] = useState(false);
    const [searchBy, setSearchBy] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [searchInputValue, setSearchInputValue] = useState(''); 
    const [fetchData, setFetchData] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setPage(parseInt(queryParams.get('pageNumber'), 10) || 0);
        setSize(parseInt(queryParams.get('pageSize'), 10) || 5);
        setSearchBy(queryParams.get('searchBy') || 'all');
        setSearchValue(queryParams.get('searchValue') || '');
        setFetchData(true); 
    }, [location.search]);

    useEffect(() => {
        if (fetchData) {
            fetchAccounts(page, size, searchBy, searchValue);
            setFetchData(false); 
        }
    }, [page, size, searchBy, searchValue, fetchData]);

    const fetchAccounts = async (page, size, searchBy, searchValue) => {
        const token = localStorage.getItem('AuthToken');
        if (!token) {
            console.error('No token found');
            navigate('/login');
            return;
        }

        try {
            let result;
            switch (searchBy) {
                case 'customerId':
                    result = await getAccountsByCustomerId(token, searchValue, page, size);
                    break;
                case 'accountNumber':
                    result = await getAccountById(token, searchValue);
                    result = { content: [result] }; 
                    break;
                case 'active':
                    result = await getActiveAccounts(token, page, size);
                    break;
                case 'inactive':
                    result = await getInactiveAccounts(token, page, size);
                    break;
                default:
                    result = await getAllAccounts(token, page, size);
            }

            if (result.content && result.content.length > 0) {
                setColumns(Object.keys(result.content[0])); 
                setAccounts(result.content);
            } else {
                setColumns([]);
                setAccounts([]);
            }
            setTotalPages(result.totalPages);
            setTotalElements(result.totalElements);
            setIsLast(result.isLast);

            const queryParams = new URLSearchParams();
            queryParams.set("pageSize", size);
            queryParams.set("pageNumber", page);
            queryParams.set("searchBy", searchBy);
            if (searchValue) queryParams.set("searchValue", searchValue);

            navigate({ search: queryParams.toString() }, { replace: true });
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleSearchByChange = (e) => {
        setSearchBy(e.target.value);
        setSearchInputValue(''); 
        setPage(0);
    };

    const handleSearchInputChange = (e) => {
        setSearchInputValue(e.target.value);
    };

    const handleSearch = () => {
        setSearchValue(searchInputValue); 
        setPage(0);
        setFetchData(true);
    };

    const handlePageSizeChange = (e) => {
        setSize(parseInt(e.target.value, 10));
        setPage(0);
        setFetchData(true);
    };

    const handleGoBack = () => {
        navigate('/admin-dashboard');
    };

    const resetFilters = () => {
        setSearchBy('all');
        setSearchInputValue('');
        setSearchValue('');
        setPage(0);
        setSize(5); 
        setFetchData(true);
    };

    return (
        <div>
            <div className="header">
                <button onClick={handleGoBack} className="btn btn-go-back">Go Back</button>
            </div>
            <h1>All Accounts</h1>
            <div className="search-filter">
                <label htmlFor="searchBy">Search By:</label>
                <select id="searchBy" value={searchBy} onChange={handleSearchByChange}>
                    <option value="all">All</option>
                    <option value="customerId">Customer ID</option>
                    <option value="accountNumber">Account Number</option>
                    <option value="active">Active Accounts</option>
                    <option value="inactive">Inactive Accounts</option>
                </select>
                {['customerId', 'accountNumber'].includes(searchBy) && (
                    <input
                        type="text"
                        placeholder={`Enter ${searchBy}`}
                        value={searchInputValue} 
                        onChange={handleSearchInputChange}
                    />
                )}
                <button onClick={handleSearch} className="btn btn-search">Search</button>
                <button onClick={resetFilters} className="btn btn-reset">Reset</button>
            </div>
            <div className="page-size-selector">
                <label htmlFor="pageSize">Page Size:</label>
                <select id="pageSize" value={size} onChange={handlePageSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>
            {accounts.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account, index) => (
                            <tr key={index}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col === 'active' 
                                            ? account[col] ? 'Active' : 'Inactive' 
                                            : account[col]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No accounts found.</p>
            )}

            <div className="pagination">
                <button 
                    disabled={page === 0} 
                    onClick={() => {
                        setPage(prevPage => prevPage - 1);
                        setFetchData(true);
                    }}
                >
                    Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button 
                    disabled={isLast} 
                    onClick={() => {
                        setPage(prevPage => prevPage + 1);
                        setFetchData(true);
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default GetAllAccounts;
