import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/LeaderBoard.css';


const Leaderboard = () => {

    const [entries, setEntries] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/leaderboard',
                    { withCredentials: true });
                setEntries(res.data);
            } catch (error) {
                console.error('Failed to load leaderboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading leaderboard...</div>;

    return (

        <div className="leaderboard-container">
            <h2 className="leaderboard-title">Leaderboard</h2>
            <div className="leaderboard-card">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Solved</th>
                            <th>Submissions</th>
                            <th>Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e, i) => (
                            <tr key={e.userId} className={i === 0 ? 'first-place' : ''}>
                                <td>{i + 1}</td>
                                <td>{e.username}</td>
                                <td>{e.solvedCount}</td>
                                <td>{e.submissionCount}</td>
                                <td>{e.accuracy.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
