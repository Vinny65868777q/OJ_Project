import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/SubmissionHistory.css';
import { Link } from 'react-router-dom';


const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchhistory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submission`, { withCredentials: true });
        setSubmissions(res.data);
      } catch (error) {
        console.error('Error fetching submission history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchhistory();
  }, []);

  if (loading) return <div className="loading">Loading submissions...</div>;

  return (
    <div className="history-container">
      <h2 className="history-title">My Submissions</h2>
      {submissions.length === 0 ? (
        <p className="no-data">You haven't made any submissions yet.</p>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Language</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => {

                const path = sub.contestId
                  ? `/contests/${sub.contestId}/problems/${sub.problemId}`
                  : `/problems/${sub.problemId}`;

                return (
                  <tr key={sub._id}
                    className={sub.verdict === 'Accepted' ? 'accepted' : 'failed'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/submission/${sub._id}`)}
                  >
                    <td className="prob-title">
                      <Link to={path}>{sub.title}</Link>
                    </td>
                    <td>{sub.language.toUpperCase()}</td>
                    <td>{sub.verdict}</td>
                    <td>{sub.executionTime != null ? `${sub.executionTime} ms` : '-'}</td>
                    <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                  </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )
      }
    </div >
  );
};


export default Submissions