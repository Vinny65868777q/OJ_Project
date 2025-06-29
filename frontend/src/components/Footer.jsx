import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        
        <footer className="footer">

            <p>© {new Date().getFullYear()} JudgeX • All rights reserved</p>

        </footer>
    );
};

export default Footer;
