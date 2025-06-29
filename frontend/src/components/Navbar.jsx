import React, { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import {  useAuth } from '../context/AuthContext.jsx';


const Navbar = () => {
    const navigate = useNavigate();
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

   const { isLoggedIn, logout,loading } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {/*When the component is removed (unmounted), this ensures:-We remove the event listener.This avoids memory leaks or bugs (like multiple listeners piling up). */
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
    logout();   //calls logout from context (clears cookie and updates login state)
    
}

  if (loading) return null;
    return (
        <nav className='navbar'>
            <div className='logo'>
                <img src="/assets/Logo.png" alt="JudgeX" className='navbar-logo' />
            </div>

            <ul className={`nav-links ${isLoggedIn ? '' : 'auth-links'}`}>
                {isLoggedIn ? (
                    <>
                        <li><Link to='/dashboard' className='nav-link'>Dashboard</Link></li>
                        <li><Link to='/problems' className='nav-link'>Problems</Link></li>
                        <li><Link to='/submission' className='nav-link'>Submissions</Link></li>
                        <li><Link to="/leaderboard" className='nav-link'>Leaderboard</Link></li>
                    </>
                ) : (
                    <>
                        
                        <li><Link to='/login' className='nav-link auth-link'>Login</Link></li>
                        <li><Link to='/register' className='nav-link auth-link'>Register</Link></li>
                    </>
                )}
            </ul>

            {isLoggedIn && (
                <div className="navbar-profile" ref={dropdownRef}>
                    <img
                        src="/assets/Avatar.png"
                        alt="User"
                        className='navbar-avatar'
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div className="avatar-dropdown">
                            <button onClick={() => alert("Help Section Coming Soon!")}>Help</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
