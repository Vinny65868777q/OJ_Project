 import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer'
import '../styles/HomePage.css';

const HomePage = () => {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate('/dashboard');  // redirect with correct URL
    }
  }, [isLoggedIn, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-wrapper">
      <main className="home-main">
        <h1>Welcome to JudgeX!</h1>
        <p>Start your coding journey — log in or register to explore problems, submit solutions, and climb the leaderboard</p>

        <div className="cards-container">
          <div className="info-card problems">
            <h2>Problems</h2>
            <p>Dive into a curated collection of coding challenges organized by topics and difficulty levels — perfect for sharpening your skills, mastering concepts, and preparing for real-world technical interviews.</p>
          </div>

          <div className="info-card">
            <h2>Submissions</h2>
            <p>Track all your code submissions in one place — view detailed results, understand verdicts like Accepted, Wrong Answer (WA), Time Limit Exceeded (TLE), and analyze your performance over time.</p>
          </div>

          <div className="info-card">
            <h2>Test Cases</h2>
            <p>Every problem is evaluated using hidden and visible test cases. Learn how your code is tested against edge cases and constraints to ensure accuracy and efficiency.</p>
          </div>

          <div className="info-card">
            <h2>Leaderboard</h2>
            <p>Compete with fellow coders and climb the rankings as you solve more problems. Track your progress, compare your performance, and aim for the top spot!</p>
          </div>

          <div className="info-card">
            <h2> How It Works</h2>
            <p>JudgeX automatically compiles and tests your code in real time. Understand the complete evaluation pipeline — from code submission to verdict — and learn how the judging system ensures fairness and accuracy.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;