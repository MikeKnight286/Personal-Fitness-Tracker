import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to login: ' + error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>

            {/* Password reset link */}
            <div>
                <Link to="/password-reset">Forgot Password?</Link>
            </div>
        </div>
    );
};

export default Login;
