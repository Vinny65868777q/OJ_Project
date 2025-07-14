// src/pages/ContestDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect , useMemo} from 'react';
import axios from 'axios';
import Countdown from '../components/Countdown';      // you already have this
import '../styles/ContestDetail.css';                 // paste the CSS there

export default function ContestDetail() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    /* ───────────────── fetch once ───────────────── */
    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/contests/${id}`, {
                withCredentials: true,
            })
            .then((res) => setContest(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

  const status = useMemo(() => {
        if (!contest?.startAt || !contest?.endAt) return 'LOADING';
        const now = Date.now();
        const startMs = new Date(contest.startAt).getTime();
        const endMs = new Date(contest.endAt).getTime();

        return now < startMs ? 'UPCOMING' : now < endMs ? 'LIVE' : 'ENDED';
    }, [contest]);
    
    if (loading) return <p style={{ textAlign: 'center' }}>Loading…</p>;
    if (!contest?._id) return <p style={{ textAlign: 'center' }}>Contest not found</p>;


  

    const alreadyJoined = userId && contest.participants.some(p =>
        (typeof p === 'string' ? p : p._id || p.user || '').toString() === userId
    );

    return (
        <div className="contest-detail">
            <header>
                <h1>{contest.title}</h1>
                <p className="subtitle">{contest.description}</p>

                {status === 'LOADING' && <span className="badge loading">Loading...</span>}
                {status === 'UPCOMING' && (
                    <>
                        <span className="badge upcoming">Upcoming</span>
                        <p className="count-pill">
                            <Countdown to={contest.startAt} />
                        </p>
                    </>
                )}
                {status === 'LIVE' && <span className="badge live">LIVE</span>}
                {status === 'ENDED' && <span className="badge ended">Ended</span>}
                {alreadyJoined && <span className="joined-pill">✔ Joined</span>}
            </header>


            {status !== 'UPCOMING' && (
                <section className="problem-table">
                    <h2>Problems</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th style={{ width: '110px' }}>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>

                            {contest.problems.map((p, idx) => (
                                <tr key={p._id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        {/* reuse your existing ProblemDetail route */}
                                        <Link to={`/contests/${id}/problems/${p._id}`}>{p.title}</Link>
                                    </td>

                                    <td>{p.difficulty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
}
