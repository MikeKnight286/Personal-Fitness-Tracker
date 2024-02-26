import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Adjust the path to match where your useAuth hook is located

function NavBar() {
    const { user, logout } = useAuth(); // Using useAuth hook for cleaner access to auth-related functionalities
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Use logout method from useAuth
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {!user && <Link to="/signup">Register</Link>}
            {!user && <Link to="/login">Log In</Link>}
            {user && <Link to="/dashboard">Dashboard</Link>}
            {user && <Link to="/settings">Settings</Link>}
            {user && <Link to="/activities">Activities</Link>}
            {user && <button onClick={handleLogout}>Log Out</button>}
            {/* Add more links or buttons for other features as needed */}
        </nav>
    );
}

export default NavBar;
