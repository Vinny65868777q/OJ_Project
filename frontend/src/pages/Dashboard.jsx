import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import axios from 'axios';
import Chart from '../components/Chart';
import Heatmap from '../components/Heatmap';
import Countdown from '../components/Countdown';


function Dashboard() {

   const [stats, setStats] = useState(null);
   const [skills, setSkills] = useState(null);
   const [contest, setContest] = useState(null);
   const [joining, setJoining] = useState(false);
   const [recommended, setRec] = useState([]);
   const [submissions, setSubs] = useState([]);
   const [leaderboard, setLeaderboard] = useState([]);

   const timeAgo = iso => {
      const diff = Math.floor((Date.now() - new Date(iso)) / 1000); // seconds

      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
   };

   useEffect(() => {

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
      axios.get('http://localhost:5000/api/contests/next', { withCredentials: true })
         .then(res => setContest(res.data))
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

   }, []);

   if (!stats || !skills || !contest) {
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
               <h3>Upcoming Contest</h3>
               {contest && contest.startsAt ? (
                  <>
                     <p className="contest-title">{contest.title}</p>
                     <p><Countdown to={contest.startsAt} /></p>
                     <button className="btn-primary">Join Contest</button>
                  </>
               ) : (
                  <p>No upcoming contests</p>
               )}
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
                     console.log(s.title)
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