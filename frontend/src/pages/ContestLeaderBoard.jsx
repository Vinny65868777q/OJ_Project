// src/pages/ContestLeaderboard.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContestLeaderBoard.css';

export default function ContestLeaderboard() {
    const { id } = useParams();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${id}/leaderboard`, { withCredentials: true })
            .then(res => setRows(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    console.log(rows);
    if (loading) return <p>Loading leaderboard…</p>;

    return (
        <div className="leaderboard">
            <h1>Contest Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th >🏆 Rank</th>
                        <th>👤 Username</th>
                        <th>✅ Score</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => (
                        <tr key={r.userId}>
                            <div className="badge-contest">
                                <span className="badge-content">
                                    {r.rank === 1 ? '🥇' :
                                        r.rank === 2 ? '🥈' :
                                            r.rank === 3 ? '🥉' : r.rank}
                                </span>
                            </div>
                            <td>{r.username}</td>
                            <td>{r.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
