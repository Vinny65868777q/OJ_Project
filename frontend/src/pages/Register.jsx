
import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function Register() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    //handleChange is not passed as a prop.It is just used directly inside the same component
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();//stops the page from refreshing when a form is submitted.
        setError('');//Clears any previous error message before trying again.
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            alert(res.data.msg);
            navigate('/login');
        } catch (error) {

            const data = error.response?.data;

            if (Array.isArray(data) && data.length > 0) {
                // Show only the first validation message
                setError(data[0].msg);
            } else {
                // Fallback for other errors (like duplicate email)
                setError(data?.message || 'Registration failed');
            }
        }
    };

    return (

        <div className="register-background-wrapper">
            <div className="register-card">
                <div className="register-left-panel">

                </div>

                <div className="register-right-panel">
                    <div className="register-form-card">
                        <h2 className="register-title">Register</h2>
                        <form className='register-form'onSubmit={handleSubmit} noValidate >
                            <input className="register-input" type="text" name="firstname" placeholder='First Name' value={formData.firstname} onChange={handleChange} required />
                            <input className="register-input" type="text" name="lastname" placeholder='Last Name' value={formData.lastname} onChange={handleChange} required />
                            <input className="register-input" type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} required />
                            <input className="register-input" type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />

                            <button className="button" type="submit">Sign Up</button>
                            {error && <p className="error-message">{error}</p>}{/*if error exists then show in red that msg else show nothing*/}
                        </form>
                        <p>Already have an account? <a href="/login">Login here</a></p>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default Register;