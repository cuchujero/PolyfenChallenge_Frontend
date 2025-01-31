import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Prospects.css'; // Importamos el archivo de estilos

const Prospects = () => {
    const [prospects, setProspects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('score');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProspects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3000/prospects', {
                params: { sortBy, order, page, limit }
            });

            setProspects(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Error fetching data from the API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProspects();
    }, [sortBy, order, page, limit]);

    const handleSort = (column) => {
        const newOrder = sortBy === column && order === 'desc' ? 'asc' : 'desc';
        setSortBy(column);
        setOrder(newOrder);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="prospects-container">
            <h1>Prospects</h1>
            <table className="prospects-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th onClick={() => handleSort('country')}>Country</th>
                        <th onClick={() => handleSort('jobTitle')}>Job Title</th>
                        <th onClick={() => handleSort('yearsOfExperience')}>Years of Experience</th>
                        <th onClick={() => handleSort('industry')}>Industry</th>
                        <th onClick={() => handleSort('companySize')}>Company Size</th>
                        <th onClick={() => handleSort('score')}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {prospects.map((prospect) => (
                        <tr key={prospect.email}>
                            <td>{prospect.name}</td>
                            <td>{prospect.email}</td>
                            <td>{prospect.country}</td>
                            <td>{prospect.jobTitle}</td>
                            <td>{prospect.yearsOfExperience}</td>
                            <td>{prospect.industry}</td>
                            <td>{prospect.companySize}</td>
                            <td>{prospect.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Prospects;
