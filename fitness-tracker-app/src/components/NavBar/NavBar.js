import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function NavBar() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Assuming you're storing the token in localStorage
        localStorage.removeItem('token');
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {!user && <Link to="/signup">Register</Link>}
            {!user && <Link to="/login">Log In</Link>}
            {user && <Link to="/dashboard">Dashboard</Link>}
            {user && <Link to="/settings">Settings</Link>}
            {user && <button onClick={handleLogout}>Log Out</button>}
            {/* Add more links or buttons for other features as needed */}
        </nav>
    );
}

export default NavBar;
