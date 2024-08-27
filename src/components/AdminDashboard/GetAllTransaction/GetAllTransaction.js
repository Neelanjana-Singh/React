import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTransactions, getTransactionById, getTransactionsByDateRange } from '../../../services/apiService';
import './GetAllTransaction.css'; 

const GetAllTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [columns, setColumns] = useState([]); 
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLast, setIsLast] = useState(false);
    const [searchId, setSearchId] = useState(''); 
    const [startDate, setStartDate] = useState(); 
    const [endDate, setEndDate] = useState(); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [page, size]);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('AuthToken');
        if (!token) {
            console.error('No token found');
            navigate('/login'); 
            return;
        }

        try {
            const result = await getAllTransactions(token, page, size);
            if (result.content && result.content.length > 0) {
                setColumns(Object.keys(result.content[0])); 
                setTransactions(result.content);
            } else {
                setColumns([]);
                setTransactions([]);
            }
            setPage(result.page);
            setSize(result.size);
            setTotalPages(result.totalPages);
            setTotalElements(result.totalElements);
            setIsLast(result.isLast);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleSearchById = async () => {
        const token = localStorage.getItem('AuthToken');
        if (!token) {
            console.error('No token found');
            navigate('/login');
            return;
        }

        try {
            const result = await getTransactionById(token, searchId);
            setColumns(Object.keys(result)); 
            setTransactions([result]);
            setTotalPages(1);
            setTotalElements(1);
            setIsLast(true);
        } catch (error) {
            console.error('Error fetching transaction by ID:', error);
        }
    };

    const handleSearchByDateRange = async () => {
        const token = localStorage.getItem('AuthToken');
        if (!token) {
            console.error('No token found');
            navigate('/login');
            return;
        }

        try {
           const start = new Date(startDate).toISOString().slice(0, -1); 
            const end = new Date(endDate).toISOString().slice(0, -1); 
            const result = await getTransactionsByDateRange(token, start, end, page, size);
            if (result.content && result.content.length > 0) {
                setColumns(Object.keys(result.content[0]));
                setTransactions(result.content);
            } else {
                setColumns([]);
                setTransactions([]);
            }
            setPage(result.page);
            setSize(result.size);
            setTotalPages(result.totalPages);
            setTotalElements(result.totalElements);
            setIsLast(result.isLast);
        } catch (error) {
            console.error('Error fetching transactions by date range:', error);
        }
    };

    const handlePageSizeChange = (e) => {
        setSize(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleGoBack = () => {
        navigate('/admin-dashboard');
    };

    const resetFilters = () => {
        setSearchId('');
        setStartDate('');
        setEndDate('');
        fetchTransactions(); 
    };

    return (
        <div>
            <div className="header">
                <button onClick={handleGoBack} className="btn btn-go-back">Go Back</button>
            </div>
            <h1>All Transactions</h1>

            <div className="search-section">
                <div className="search-by-id">
                    <input 
                        type="text" 
                        placeholder="Search by Transaction ID" 
                        value={searchId} 
                        onChange={(e) => setSearchId(e.target.value)} 
                    />
                    <button onClick={handleSearchById}>Search</button>
                </div>
                <div className="search-by-date">
                    <input 
                        type="date" 
                        placeholder="Start Date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                    <input 
                        type="date" 
                        placeholder="End Date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                    <button onClick={handleSearchByDateRange}>Search</button>
                </div>
                <button className="btn btn-reset" onClick={resetFilters}>Reset</button>
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
            {transactions.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col === 'active' 
                                            ? transaction[col] ? 'Active' : 'Inactive' 
                                            : transaction[col]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found.</p>
            )}

            <div className="pagination">
                <button 
                    disabled={page === 0} 
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button 
                    disabled={isLast} 
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default GetAllTransactions;
