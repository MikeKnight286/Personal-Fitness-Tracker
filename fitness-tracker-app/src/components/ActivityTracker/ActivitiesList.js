import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as needed
import activityService from '../../services/activityService';

const ActivitiesList = () => {
    const { loading: authLoading } = useContext(AuthContext); // Destructure loading state from AuthContext
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Only attempt to fetch activities if the authentication loading state is false
        if (!authLoading) {
            const fetchActivities = async () => {
                try {
                    setLoading(true);
                    const data = await activityService.getAllActivities(); // Fetch all activities
                    setActivities(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message || 'An error occurred while fetching activities.');
                    setLoading(false);
                }
            };

            fetchActivities();
        }
    }, [authLoading]); // Depend on the authentication loading state

    if (authLoading || loading) return <div>Loading activities...</div>; // Show loading indicator if either authLoading or loading is true
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Activities List</h2>
            {activities.length > 0 ? (
                <ul>
                    {activities.map((activity) => (
                        <li key={activity.id}>
                            {activity.name} - {activity.calories_burned_per_minute} calories/minute
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No activities found.</p>
            )}
        </div>
    );
};

export default ActivitiesList;
