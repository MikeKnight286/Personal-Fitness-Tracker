import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth'; 
import ActivitiesList from '../components/ActivityTracker/ActivitiesList';
import AddUserActivity from '../components/ActivityTracker/AddUserActivity';
import UserActivitiesList from '../components/ActivityTracker/UserActivitiesList';
import CreateActivity from '../components/ActivityTracker/CreateActivity';

function ActivityLog() {
    const { user } = useAuth(); // Use loading state to wait for auth check
    const navigate = useNavigate(); // For redirecting non-authenticated users

    // Redirect non-authenticated users to login page
    useEffect(() => {
        console.log("Checking user status", { user });
        if (!user) {
            navigate('/login'); // Redirect to login, adjust as necessary
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Activity Tracker</h1>
            {user && (
                <>
                    {user.isAdmin && <CreateActivity />}
                    <ActivitiesList />
                    <AddUserActivity />
                    <UserActivitiesList />
                </>
            )}
        </div>
    );
}

export default ActivityLog;
