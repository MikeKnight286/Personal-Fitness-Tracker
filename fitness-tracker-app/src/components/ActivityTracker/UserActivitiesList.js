import React, { useEffect, useState, useContext } from 'react';
import activityService from '../../services/activityService';
import { AuthContext } from '../../context/AuthContext';

function UserActivitiesList() {
    const { user } = useContext(AuthContext); 
    const userId = user?.id;
    const [userActivities, setUserActivities] = useState([]);

    useEffect(() => {
        const fetchUserActivities = async () => {
            if (userId) { // Check if userId is not undefined
                try {
                    const data = await activityService.getUserActivities(userId);
                    setUserActivities(data);
                } catch (error) {
                    alert(error.message);
                }
            }
        };
        fetchUserActivities();
    }, [userId]); // useEffect dependency array

    return (
        <div>
            <h2>Your Logged Activities</h2>
            <ul>
                {userActivities.map((activity) => (
                    <li key={activity.id}>{activity.name} - {activity.durationMinutes} minutes</li>
                ))}
            </ul>
        </div>
    );
}

export default UserActivitiesList;
