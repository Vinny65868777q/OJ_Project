import React, { useState, useEffect } from 'react';
import '../styles/SubmissionDetail.css';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SubmissionDetail =  () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [sub, setSub] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submission/${id}`,
                    { withCredentials: true });
                setSub(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);


    if (loading) return <p>Loading…</p>;
    if (!sub) return <p>Submission not found.</p>;

    return (
    <div className="submission-detail">
      <Link to="/submission" className="back-button">&larr; Back to History</Link>
      <h2>Submission Details</h2>
      
        <div className="meta">
        <p><strong>Problem:</strong> {sub.title}</p>
        <p><strong>Language:</strong> {sub.language.toUpperCase()}</p>
        <p><strong>Verdict:</strong> {sub.verdict}</p>
        <p><strong>Runtime:</strong> {sub.executionTime ?? '-'} ms</p>
        <p><strong>Submitted:</strong> {new Date(sub.submittedAt).toLocaleString()}</p>
      </div>

      <div className="code-block">
        <h3>Source Code</h3>
        <pre>{sub.code}</pre>
      </div>

    
    </div>
      );
};

export default SubmissionDetail;