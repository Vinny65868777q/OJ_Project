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

        <section className="hero">
          <h1>
            Welcome to&nbsp;<span className="brand">JudgeX</span>
          </h1>

          <p className="tagline">
            Start your coding journey — log in or register to explore problems,
            submit solutions, and climb the leaderboard.
          </p>

          <p className="intro">
            Whether you're a beginner or a seasoned programmer, JudgeX offers a wide
            range of challenges to sharpen your skills. Practice real-world coding
            problems, improve your algorithmic thinking, and get instant feedback on
            your submissions. Compete with others, track your progress, and become a
            part of a growing community of developers.
          </p>

          {/* decorative blobs + wave divider */}
          <div className="blob b1"></div>
          <div className="blob b2"></div>
          <svg className="wave" viewBox="0 0 1440 140" preserveAspectRatio="none">
            <path d="M0,80 C240,140 480,20 720,60 C960,100 1200,20 1440,80 L1440,140 L0,140 Z"></path>
          </svg>
        </section>

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


          <div className='info-card'>
            <h2>AI Feature</h2>
            <p>Our AI helps you understand complex problem statements and offers contextual hints after your first unsuccessful submission — guiding you without giving away the full solution.</p>
          </div>
          <div className='info-card'>
            <h2>Weekly Contests</h2>
            <p>Participate in thrilling weekly contests designed to test your speed, logic, and problem-solving skills. Compete with peers, climb the leaderboard, and earn recognition for your coding prowess.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;