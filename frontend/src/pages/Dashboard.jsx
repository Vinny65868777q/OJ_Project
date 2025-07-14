import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import axios from 'axios';
import Chart from '../components/Chart';
import Heatmap from '../components/Heatmap';
import Countdown from '../components/Countdown';
import { Link } from 'react-router-dom';


function Dashboard() {

   const [stats, setStats] = useState(null);
   const [skills, setSkills] = useState(null);
   const [contests, setContests] = useState([]);
   const [joiningId, setJoiningId] = useState(false);
   const [recommended, setRec] = useState([]);
   const [submissions, setSubs] = useState([]);
   const [leaderboard, setLeaderboard] = useState([]);
   const [registered, setReg] = useState(false);
   const [userId, setUserId] = useState(null);

   const timeAgo = iso => {
      const diff = Math.floor((Date.now() - new Date(iso)) / 1000); // seconds

      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
   };

   useEffect(() => {
      axios
         .get('http://localhost:5000/api/user/profile', { withCredentials: true })
         .then(res => {
            setUserId(res.data._id);
         })
         .catch(err => {
            console.error("Error fetching user:", err);
         });
   }, []);


   useEffect(() => {
      if (!userId) return;

      // 1) solved history
      axios
         .get('http://localhost:5000/api/dashboard/stats', { withCredentials: true })
         .then(res => setStats(res.data))
         .catch(console.error);

      // 2) skills
      axios
         .get('http://localhost:5000/api/dashboard/skills', { withCredentials: true })
         .then(res => setSkills(res.data))
         .catch(console.error);

      //3) contest
      // fetch once

      axios.get('http://localhost:5000/api/contests/next', { withCredentials: true })
         .then(res => setContests(res.data))        // ← array, rename state
         .catch(console.error);



      // 4) recommended problems
      axios.get('http://localhost:5000/api/dashboard/recommended-problems', { withCredentials: true })
         .then(res => setRec(res.data))
         .catch(console.error);

      // 5) recent submissions
      axios.get('http://localhost:5000/api/dashboard/submission', { withCredentials: true })
         .then(res => setSubs(res.data))
         .catch(console.error);

      // 6) leaderboard
      axios.get('http://localhost:5000/api/leaderboard?limit=5', { withCredentials: true })
         .then(res => setLeaderboard(res.data))
         .catch(console.error);

   }, [userId]);

   if (!stats || !skills) {
      return <div className="dashboard-container">Loading…</div>;
   }

   return (
      <div className="dashboard-container">
         <div className="dashboard-hero">
            <h1>
               <span className="hero-highlight">Start&nbsp;your&nbsp;coding&nbsp;journey</span>
            </h1>
         </div>

         <div className="cards-grid">
            {/* 1 — Solved Problems */}
            <div className="card chart-card wide">
               <h3>Solved Problems</h3>
               <Chart data={stats.solvedHistory} />
            </div>

            {/* 2 — Skill Mastery */}
            <div className="card skill-card">
               <h3>Skill Mastery</h3>
               <div className="streak">
                  Current streak: <strong>{skills.streak} days</strong>
               </div>
               <Heatmap data={skills.heatmap} />
            </div>

            {/* 3 — Upcoming Contest */}
            <div className="card contest-card tall">
                <div className="contest-scroll">
               <h3>Contests</h3>
               {contests.length === 0 ? (
                  <p>No active contests</p>
               ) : (
                  contests.map(ct => {
                     const alreadyJoined = ct.participants.some(p =>
                        (typeof p === 'string' ? p : p._id || p.user || '').toString() === userId
                     );
                     const label = () => {
                        if (alreadyJoined) {
                           return ct.status === 'WAIT_RESULTS' ? 'Wait for results' : 'Registered';
                        }
                        if (ct.status === 'JOIN_NOW') return joiningId === ct._id ? 'Joining…' : 'Join Now';
                        /* NO_MORE_TRIALS or WAIT_RESULTS for non-joined user */
                        return 'No more trials';
                     };

                     // helper: can the button still be clicked?
                     const clickable = !alreadyJoined && ct.status === 'JOIN_NOW';

                     return (
                        <div key={ct._id} className="contest-box">
                           <p className="contest-title">{ct.title}</p>
                           <p className="countdown"><Countdown to={ct.startAt} /></p>

                           <button
                              className="btn-primary"
                              disabled={!clickable || joiningId === ct._id}              
                              onClick={async () => {
                                 if (!clickable || joiningId) return;
                                 setJoiningId(ct._id);

                                 try {
                                    await axios.post(
                                       `http://localhost:5000/api/contests/${ct._id}/join`,
                                       {},
                                       { withCredentials: true }
                                    );

                                   
                                    const { data } = await axios.get(
                                       'http://localhost:5000/api/contests/next',
                                       { withCredentials: true }
                                    );
                                    setContests(data);
                                 } catch (e) {
                                    alert(e.response?.data?.error || 'Error registering');
                                 } finally {
                                    setJoiningId(null);
                                 }
                              }}
                           >
                              {label()}                                               
                           </button>

                           <Link to={`/contests/${ct._id}`} className="btn-ghost">
                              View details
                           </Link>
                        </div>
                     );
                  })
               )}
            </div>
             </div>
            {/* 4 — Recommended Problems */}
            <div className="card recs-card">
               <h3>Recommended Problems</h3>
               <ul>
                  {recommended.map(p => (
                     <li key={p._id}>
                        {p.title}
                        <span className={`badge ${p.difficulty.toLowerCase()}`}>
                           {p.difficulty}
                        </span>
                     </li>
                  ))}
               </ul>
            </div>

            {/* 5 — Recent Submissions */}
            <div className="card subs-card">
               <h3>Recent Submissions</h3>
               <ul className='scrollable'>
                  {submissions.map(s => {

                     const verdictCls = s.verdict.replace(/\s+/g, '-').toLowerCase(); // "Accepted"→accepted

                     return (
                        <li key={s._id}>
                           <span className={`status-dot ${verdictCls}`}>●</span>
                           <span className="sub-title">{s.title}</span>
                           <small className="sub-time">({timeAgo(s.submittedAt)})</small>
                        </li>
                     );
                  })}
               </ul>
            </div>

            {/* 6 — Leaderboard */}
            <div className="card lb-card">
               <h3>Leaderboard</h3>
               <ol>
                  {leaderboard.map((u, i) => (
                     <li
                        key={u.userId || `${u.username}-${u.solvedCount}-${i}`}
                        className={`rank-${i + 1}`}          /* add rank-X class (1-based)  */
                     >
                        <span className={`rank-badge rank-${i + 1}`}>{i + 1}</span>
                        <span className="lb-name">{u.username}</span>
                        <span className="lb-score">{u.solvedCount}</span>
                     </li>
                  ))}
               </ol>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;