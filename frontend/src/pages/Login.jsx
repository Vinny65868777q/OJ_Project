import { useReact, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
            alert(res.data.message);
            navigate('/dashboard');

        } catch (error) {
            console.error(error.response);
            // Show error message from backend
            const data = error.response?.data;

            if (Array.isArray(data) && data.length > 0) {
                // Show only the first validation message
                setErrorMsg(data[0].message);
            } else {
                // Fallback for other errors (like duplicate email)
                setErrorMsg(data?.message || 'Login failed');
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

            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
        </div>
    );
}

export default Login;