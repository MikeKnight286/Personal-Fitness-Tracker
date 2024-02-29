import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';

function PasswordReset() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return; // Prevent form submission
        }
        try {
            // Posting token and newPassword to server
            await authService.resetPassword(token, password);
            alert('Your password has been reset successfully');
            navigate('/login');
        } catch (error) {
            alert('Error resetting your password');
        }
    };

    return (
        <div>
            <h2>Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default PasswordReset;
