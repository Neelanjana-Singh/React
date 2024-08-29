import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GetAllBank.css';
import { getAllBanks, getBankById, getBankByName, getBankByAbbreviation } from '../../../services/apiService';

const GetAllBanks = () => {
    const [banks, setBanks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLast, setIsLast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('AuthToken');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setPage(parseInt(queryParams.get('pageNumber'), 10) || 0);
        setSize(parseInt(queryParams.get('pageSize'), 10) || 5);
        setSearchBy(queryParams.get('searchBy') || '');
        setSearchValue(queryParams.get('searchValue') || '');
        setShouldFetch(true);
    }, [location.search]);

    useEffect(() => {
        if (shouldFetch) {
            fetchBanks();
            setShouldFetch(false);
        }
    }, [page, size, searchBy, searchValue, shouldFetch]);

  

    const fetchBanks = async () => {
        setLoading(true);
        try {
            // Ensure token is available
            const token = localStorage.getItem('AuthToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            let result;
            if (searchBy === 'id') {
                result = await getBankById(token, searchValue);
                result = { content: [result] };
            } else if (searchBy === 'name') {
                result = await getBankByName(token, searchValue);
                result = { content: [result] };
            } else if (searchBy === 'abbreviation') {
                result = await getBankByAbbreviation(token, searchValue);
                result = { content: [result] };
            } else {
                result = await getAllBanks(token, page, size);
            }
    
            if (result.content && result.content.length > 0) {
                setColumns(Object.keys(result.content[0]));
                setBanks(result.content);
            } else {
                setColumns([]);
                setBanks([]);
            }
    
            setTotalPages(result.totalPages || 0);
            setTotalElements(result.totalElements || 0);
            setIsLast(result.isLast || false);
    
            const queryParams = new URLSearchParams();
            queryParams.set('pageNumber', page);
            queryParams.set('pageSize', size);
            if (searchBy) queryParams.set('searchBy', searchBy);
            if (searchValue) queryParams.set('searchValue', searchValue);
            navigate({ search: queryParams.toString() }, { replace: true });
    
        } catch (err) {
            console.error('Failed to fetch banks:', err.message);
            setError('Failed to fetch banks: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageSizeChange = (e) => {
        setSize(parseInt(e.target.value, 10));
        setPage(0);
        setShouldFetch(true);
    };

    const handleSearchChange = (e) => {
        setSearchBy(e.target.value);
    };

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        setPage(0);
        setShouldFetch(true);
    };

    const handleReset = () => {
        setSearchBy('');
        setSearchValue('');
        setPage(0);
        setSize(5);
        setShouldFetch(true);
    };

    const handleGoBack = () => {
        navigate('/admin-dashboard');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="banks-table">
            <div className="header">
                <button onClick={handleGoBack} className="btn-go-back">Go Back</button>
            </div>
            <h1>All Banks</h1>
            <div className="search-bar">
                <label htmlFor="searchBy">Search By:</label>
                <select id="searchBy" value={searchBy} onChange={handleSearchChange}>
                    <option value="">Select</option>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="abbreviation">Abbreviation</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter search value"
                    value={searchValue}
                    onChange={handleSearchValueChange}
                />
                <button onClick={handleSearch}>Search</button>
                <button className="btn-reset" onClick={handleReset}>Reset</button>
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

            {banks.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {banks.map((bank, index) => (
                            <tr key={index}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{bank[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No banks found.</p>
            )}

            <div className="pagination">
                <button
                    disabled={page === 0}
                    onClick={() => {
                        setPage(prevPage => prevPage - 1);
                        setShouldFetch(true);
                    }}
                >
                    Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button
                    disabled={isLast}
                    onClick={() => {
                        setPage(prevPage => prevPage + 1);
                        setShouldFetch(true);
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default GetAllBanks;
