import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Problem.css';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Problem = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problem/`, {
          withCredentials: true,
        });
        setProblems(res.data);
      } catch (err) {
        console.error('Error fetching problems:', err);
      }
    };
    fetchProblems();
  }, []);

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'Easy';
    if (diff === 'medium') return 'Medium';
    return 'Hard';
  };

  return (
    <div className="problem-list-container">
      <div className="problem-list-header">
        <h2>Problem List</h2>
        <input className="problem-search" placeholder="🔍 Search questions" />
      </div>
      <div className="problem-items">
        {problems.map((p, idx) => (
          <Link to={`/problems/${p._id}`} key={p._id} className="problem-item">
            <div className="problem-index">
              {p.solvedByUser && <FaCheck className="check-icon" />} {idx + 1}.
            </div>
            <div className="problem-title">{p.title}</div>
            <div className={`problem-difficulty ${getDifficultyColor(p.difficulty)}`}>
              {p.difficulty}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Problem;