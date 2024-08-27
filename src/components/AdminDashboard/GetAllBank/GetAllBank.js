import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [searchBy, setSearchBy] = useState(''); // State for search type
    const [searchValue, setSearchValue] = useState(''); // State for search value
    const [shouldFetch, setShouldFetch] = useState(false); // Control fetching data

    const navigate = useNavigate();
    const token = localStorage.getItem('AuthToken');

    // Fetch all banks data initially
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const result = await getAllBanks(token, page, size);
                if (result.content && result.content.length > 0) {
                    setColumns(Object.keys(result.content[0]));
                    setBanks(result.content);
                } else {
                    setColumns([]);
                    setBanks([]);
                }
                setPage(result.page || 0);
                setSize(result.size || size);
                setTotalPages(result.totalPages || 0);
                setTotalElements(result.totalElements || 0);
                setIsLast(result.isLast || false);
            } catch (err) {
                setError('Failed to fetch banks');
            } finally {
                setLoading(false);
            }
        };

        fetchBanks();
    }, [token, page, size]);

    // Fetch data based on search criteria when search button is clicked
    useEffect(() => {
        if (shouldFetch) {
            const fetchBanks = async () => {
                try {
                    let result;
                    if (searchBy === 'id') {
                        result = await getBankById(token, searchValue);
                        result = { content: [result] }; // Wrap in content array
                    } else if (searchBy === 'name') {
                        result = await getBankByName(token, searchValue);
                        result = { content: [result] }; // Wrap in content array
                    } else if (searchBy === 'abbreviation') {
                        result = await getBankByAbbreviation(token, searchValue);
                        result = { content: [result] }; // Wrap in content array
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
                    setPage(result.page || 0);
                    setSize(result.size || size);
                    setTotalPages(result.totalPages || 0);
                    setTotalElements(result.totalElements || 0);
                    setIsLast(result.isLast || false);
                } catch (err) {
                    setError('Failed to fetch banks');
                } finally {
                    setLoading(false);
                }
            };

            fetchBanks();
            setShouldFetch(false); // Reset after fetching
        }
    }, [shouldFetch, token, page, size, searchBy, searchValue]);

    const handlePageSizeChange = (e) => {
        setSize(parseInt(e.target.value, 10));
        setPage(0); // Reset to first page
    };

    const handleGoBack = () => {
        navigate('/admin-dashboard');
    };

    const handleSearchChange = (e) => {
        setSearchBy(e.target.value);
    };

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        setPage(0); // Reset page when searching
        setShouldFetch(true); // Trigger search fetch
    };

    const handleReset = () => {
        setSearchBy('');
        setSearchValue('');
        setPage(0);
        setSize(5);
        setShouldFetch(true); // Fetch all banks after reset
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
                    <option value="">None</option>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="abbreviation">Abbreviation</option>
                </select>
                <input 
                    type="text" 
                    placeholder={`Enter ${searchBy}`} 
                    value={searchValue} 
                    onChange={handleSearchValueChange}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleReset} className="btn-reset">Reset</button>
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
                <table>
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
                                    <td key={colIndex}>
                                        {col === 'active' 
                                            ? (bank[col] ? 'Active' : 'Inactive')
                                            : bank[col]
                                        }
                                    </td>
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

export default GetAllBanks;
