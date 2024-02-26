import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ActivitiesList from '../components/ActivityTracker/ActivitiesList';
import AddUserActivity from '../components/ActivityTracker/AddUserActivity';
import UserActivitiesList from '../components/ActivityTracker/UserActivitiesList';
import CreateActivity from '../components/ActivityTracker/CreateActivity';

function ActivityLog() {
    const { user } = useContext(AuthContext);
    console.log(user); // Check the user object
    console.log(user?.isAdmin); // Check the isAdmin property

    return (
        <div>
            <h1>Activity Tracker</h1>
            {user && <ActivitiesList />}
            {user && user.isAdmin && <CreateActivity />}
            {user && <AddUserActivity />}
            {user && <UserActivitiesList />}
        </div>
    );
}

export default ActivityLog;
