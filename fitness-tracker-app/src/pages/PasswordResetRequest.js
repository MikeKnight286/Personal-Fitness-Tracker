import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send password reset link to user's email
            await authService.passwordResetRequest(email);
            alert('If an account with that email exists, we have sent a password reset email.');
            navigate('/login');
        } catch (error) {
            alert('Error sending password reset email');
        }
    };

    return (
        <div>
            <h2>Password Reset Request</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
}

export default PasswordResetRequest;
