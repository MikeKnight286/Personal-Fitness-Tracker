import React, { useState } from 'react';
import workoutPlansService from '../../services/workoutplansService'; 

const CreateWorkoutPlan = () => {
    const [workoutPlanData, setWorkoutPlanData] = useState({
        name: '',
        description: '',
        target_goal: '',
        difficulty_level: '',
        duration_weeks: '',
        sessions_per_week: '',
        premium_only: false,
        video_url: '',
        prerequisites: '',
        tags: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWorkoutPlanData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Local Validation
        if (workoutPlanData.name.length < 3) {
            return alert('Name must be over 3 characters.');
        }

        if (workoutPlanData.sessions_per_week < 1 || workoutPlanData.sessions_per_week > 7) {
            return alert('Sessions per week must be between 1 and 7.');
        }
        try {
            // Prepare tags for submission
            const submissionData = {
                ...workoutPlanData,
                tags: workoutPlanData.tags.split(',').map(tag => tag.trim()) 
            };
            console.log("Submitting workout plan data:", submissionData);
            // Create new workout plan
            await workoutPlansService.createWorkoutPlan(submissionData);
            alert('Workout plan created successfully');
            // Reset the form 
            setWorkoutPlanData({
                name: '',
                description: '',
                target_goal: '',
                difficulty_level: '',
                duration_weeks: '',
                sessions_per_week: '',
                premium_only: false,
                video_url: '',
                prerequisites: '',
                tags: ''
            });
        } catch (error) {
            console.error("Failed to create workout plan:", error);
            alert(`Failed to create workout plan: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Create New Workout Plan</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={workoutPlanData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={workoutPlanData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="target_goal">Target Goal:</label>
                    <input
                        type="text"
                        id="target_goal"
                        name="target_goal"
                        value={workoutPlanData.target_goal}
                        onChange={handleChange}
                        placeholder="Target Goal"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="difficulty_level">Difficulty Level:</label>
                    <select
                        id="difficulty_level"
                        name="difficulty_level"
                        value={workoutPlanData.difficulty_level}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Difficulty Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="duration_weeks">Duration (Weeks):</label>
                    <input
                        type="number"
                        id="duration_weeks"
                        name="duration_weeks"
                        value={workoutPlanData.duration_weeks}
                        onChange={handleChange}
                        placeholder="Duration in Weeks"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="sessions_per_week">Sessions per Week:</label>
                    <input
                        type="number"
                        id="sessions_per_week"
                        name="sessions_per_week"
                        value={workoutPlanData.sessions_per_week}
                        onChange={handleChange}
                        placeholder="Sessions per Week"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="video_url">Video URL:</label>
                    <input
                        type="url"
                        id="video_url"
                        name="video_url"
                        value={workoutPlanData.video_url}
                        onChange={handleChange}
                        placeholder="Video URL"
                    />
                </div>
                <div>
                    <label htmlFor="prerequisites">Prerequisites:</label>
                    <input
                        type="text"
                        id="prerequisites"
                        name="prerequisites"
                        value={workoutPlanData.prerequisites}
                        onChange={handleChange}
                        placeholder="Prerequisites"
                    />
                </div>
                <div>
                    <label htmlFor="premium_only">Premium Only:</label>
                    <input
                        type="checkbox"
                        id="premium_only"
                        name="premium_only"
                        checked={workoutPlanData.premium_only}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={workoutPlanData.tags}
                        onChange={handleChange}
                        placeholder="Tags"
                    />
                </div>
                <button type="submit">Create Workout Plan</button>
            </form>
        </div>
    );
};

export default CreateWorkoutPlan;
