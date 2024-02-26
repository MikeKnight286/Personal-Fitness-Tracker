import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Adjust the import path as needed
import activityService from '../../services/activityService'; // Adjust the import path as needed

const ActivitiesList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth(); // Access the user object

    useEffect(() => {
        const fetchActivities = async () => {
            if (!user) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await activityService.getUserActivities(user.id); // Use user.id here
                setActivities(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching activities.');
                setLoading(false);
            }
        };

        fetchActivities();
    }, [user]); // Depend on user to refetch when the user logs in/out

    if (loading) return <div>Loading activities...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Activities List</h2>
            {activities.length > 0 ? (
                <ul>
                    {activities.map((activity) => (
                        <li key={activity.id}>
                            {activity.name} - {activity.description}
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
