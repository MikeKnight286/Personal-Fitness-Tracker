import React, { useEffect, useState } from 'react';
import activityService from '../../services/activityService';
import { useAuth } from '../../hooks/useAuth';

function UserActivitiesList() {
    const { user } = useAuth();
    const [userActivities, setUserActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserActivities = async () => {
            if (!user) {
                setError('User must be logged in to view activities.');
                setLoading(false);
                return;
            }

            try {
                const data = await activityService.getUserActivities(); 
                setUserActivities(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user activities:', error);
                setError(`Failed to fetch user activities: ${error.message}`);
                setLoading(false);
            }
        };

        fetchUserActivities();
    }, [user]); // Depend on the user object to refetch when the user logs in/out

    if (loading) return <div>Loading activities...</div>;
    if (error) return <div>{error}</div>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
        const localDate = new Date(date.getTime() - userTimezoneOffset); // Adjust date to local timezone
        return localDate.toISOString().split('T')[0]; // Converts date to YYYY-MM-DD format
    };
    

    return (
        <div>
            <h2>Your Logged Activities</h2>
            {userActivities.length > 0 ? (
                <ul>
                    {userActivities.map((activity, index) => (
                        <li key={activity.id || index}>
                            {activity.activityName} - {activity.durationMinutes} minutes - {activity.caloriesBurned} calories burned on {formatDate(activity.activityDate)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No activities logged yet.</p>
            )}
        </div>
    );
}

export default UserActivitiesList;