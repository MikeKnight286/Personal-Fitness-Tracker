import React, { useState } from 'react';
import activityService from '../../services/activityService';

function CreateActivity() {
    const [activityData, setActivityData] = useState({ name: '', caloriesBurnedPerMinute: '' });

    const handleChange = (e) => {
        setActivityData({ ...activityData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await activityService.createActivity(activityData);
            alert('Activity created successfully');
            // Optionally reset form or redirect
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Create New Activity</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={activityData.name}
                    onChange={handleChange}
                    placeholder="Activity Name"
                    required
                />
                <input
                    type="number"
                    name="caloriesBurnedPerMinute"
                    value={activityData.caloriesBurnedPerMinute}
                    onChange={handleChange}
                    placeholder="Calories Burned Per Minute"
                    required
                />
            </form>
       </div>
    );
}

export default CreateActivity;   
