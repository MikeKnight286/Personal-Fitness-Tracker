import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AddDietEntry from '../components/DietTracker/AddDietEntry';
import DietList from '../components/DietTracker/DietList';

const DietLog = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect non-authenticated users to the login page
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Diet Log</h1>
            {user && (
                <>
                    <AddDietEntry />
                    <DietList />
                </>
            )}
        </div>
    );
};

export default DietLog;
