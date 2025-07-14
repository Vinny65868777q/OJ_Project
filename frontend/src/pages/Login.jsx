import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useAuth } from '../context/AuthContext';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
            login();
            alert(res.data.message);

            if (res.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            console.error(error.response);
            // Show error message from backend
            const data = error.response?.data;

            if (Array.isArray(data) && data.length > 0) {
                // Show only the first validation message
                setErrorMsg(data[0].msg);
            } else if (data?.message) {
                setErrorMsg(data.message);
            }
            // Fallback
            else {
                setErrorMsg('Login failed. Please try again.');
            }

        }
    };

    return (
        <div className='login-container'>

            <div className="login-right">

                <form onSubmit={handleLogin} noValidate>
                    <h2>Login</h2>
                    <input className='login-input' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className='login-input' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <button type="submit">Login</button>
                </form>

                <p className='already-message'>Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </div>
    );
}

export default Login;