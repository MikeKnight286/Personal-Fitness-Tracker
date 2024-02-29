import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import activityService from '../../services/activityService';

function AddUserActivity() {
    const { user } = useAuth(); // Use useAuth hook to access the current user
    const [userActivityData, setUserActivityData] = useState({
        activityId: '',
        durationMinutes: '',
        activityDate: '',
    });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activityService.getAllActivities(); // Fetch activities
                setActivities(data);
            } catch (error) {
                alert(`Failed to fetch activities: ${error.message}`);
            }
        };

        fetchActivities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserActivityData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Add user-logged activity
            await activityService.addUserActivity({ activityId: userActivityData.activityId, durationMinutes: userActivityData.durationMinutes, activityDate: userActivityData.activityDate });
            alert('Activity logged successfully');
            setUserActivityData({ activityId: '', durationMinutes: '', activityDate: '' }); // Reset form after successful submission
        } catch (error) {
            alert(`Failed to log activity: ${error.message}`);
            console.log('Current user:', user);
        }
    };

    return (
        <div>
            <h2>Log an Activity</h2>
            <form onSubmit={handleSubmit}>
                <select 
                    name="activityId" 
                    value={userActivityData.activityId} 
                    onChange={handleChange} 
                    required>
                    <option value="">Select an Activity</option>
                    {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                            {activity.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="durationMinutes"
                    value={userActivityData.durationMinutes}
                    onChange={handleChange}
                    placeholder="Duration in minutes"
                    required
                />
                <input
                    type="date"
                    name="activityDate"
                    value={userActivityData.activityDate}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Log Activity</button>
            </form>
        </div>
    );
}

export default AddUserActivity;
