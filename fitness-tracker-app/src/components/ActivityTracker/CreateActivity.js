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
            // Assuming createActivity is correctly implemented in the activityService
            await activityService.createActivity(activityData);
            alert('Activity created successfully');
            // Optionally, reset the form or redirect the user
            setActivityData({ name: '', caloriesBurnedPerMinute: '' });
            // If you want to redirect the user, consider using the useNavigate hook from react-router-dom
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
