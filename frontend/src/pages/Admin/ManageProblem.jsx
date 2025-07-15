import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageProblem.css';   // see CSS below

export default function ManageProblems() {
  const [problems, setProblems] = useState(null);
  const [errMsg,   setErr]      = useState('');

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problem/allmyproblem`, { withCredentials:true })
         .then(res=>setProblems(res.data))
         .catch(err=>setErr(err.response?.data?.error || 'Error'));
  },[]);

  if (errMsg)     return <p className="center-msg">{errMsg}</p>;
  if (!problems)  return <p className="center-msg">Loading…</p>;
  if (!problems.length)
       return <p className="center-msg">No problems created yet.</p>;

  return (
    <div className="manage-container">
      <h2>Your Problems</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th style={{width:'110px'}}>Difficulty</th>
            <th style={{width:'160px'}}>Created</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(p=>(
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>
                <span className={`diff-chip ${p.difficulty}`}>
                  {p.difficulty}
                </span>
              </td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
