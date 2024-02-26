import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Adjust the import path as needed

const Signup = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await register({ email: userData.email, password: userData.password });
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to signup: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={userData.password} onChange={handleChange} required />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;
