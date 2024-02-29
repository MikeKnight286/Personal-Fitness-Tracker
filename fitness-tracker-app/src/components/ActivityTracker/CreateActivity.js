import React, { useState } from 'react';
import activityService from '../../services/activityService'; 

const CreateActivity = () => {
    const [activityData, setActivityData] = useState({
        name: '',
        caloriesBurnedPerMinute: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivityData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create new activity by admin
            await activityService.createActivity(activityData);
            alert('Activity created successfully');
            // Reset the form 
            setActivityData({ name: '', caloriesBurnedPerMinute: '' });
        } catch (error) {
            alert(`Failed to create activity: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Create New Activity</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Activity Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={activityData.name}
                        onChange={handleChange}
                        placeholder="Activity Name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="caloriesBurnedPerMinute">Calories Burned Per Minute:</label>
                    <input
                        type="number"
                        id="caloriesBurnedPerMinute"
                        name="caloriesBurnedPerMinute"
                        value={activityData.caloriesBurnedPerMinute}
                        onChange={handleChange}
                        placeholder="Calories Burned Per Minute"
                        required
                    />
                </div>
                <button type="submit">Create Activity</button>
            </form>
        </div>
    );
};

export default CreateActivity;
