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
     
      <p>This is the home page. Please login or register.</p>
      </main>
      <Footer/>
    </div>
    
  );
};

export default HomePage;