import React, { useState, useEffect, useContext } from 'react';
import activityService from '../../services/activityService';
import { AuthContext } from '../../context/AuthContext';

function AddUserActivity() { 
    const { user } = useContext(AuthContext); 
    const userId = user?.id; 

    const [userActivityData, setUserActivityData] = useState({
        activityId: '',
        durationMinutes: ''
    });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activityService.getAllActivities();
                setActivities(data);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchActivities();
    }, []); 

    const handleChange = (e) => {
        setUserActivityData({ ...userActivityData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Include userId when sending data
            await activityService.addUserActivity({ ...userActivityData, userId });
            alert('Activity logged successfully');
            // 
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Log an Activity</h2>
            <form onSubmit={handleSubmit}>
                <select name="activityId" value={userActivityData.activityId} onChange={handleChange} required>
                    <option value="">Select an Activity</option>
                    {activities.map((activity) => (
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
                <button type="submit">Log Activity</button>
            </form>
        </div>
    );
}

export default AddUserActivity;
