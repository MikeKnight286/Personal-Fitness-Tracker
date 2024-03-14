import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workoutPlansService from '../../services/workoutplansService'; 

const UpdateWorkoutPlan = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {   
        const fetchWorkoutPlan = async () => {
            try {
                const data = await workoutPlansService.getWorkoutPlanById(planId);
                if (data && data.length > 0) {
                    // Split tags array into comma-separated string for the form
                    const planData = { ...data, tags: data.tags.join(', ') };
                    setWorkoutPlanData(planData);
                } else {
                    setError('No workout plan found.');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch workout plan.');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkoutPlan();
    }, [planId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWorkoutPlanData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Reformat tags from comma-separated string back into an array for submission
        const submissionData = {
            ...workoutPlanData,
            tags: workoutPlanData.tags.split(',').map(tag => tag.trim())
        };

        try {
            await workoutPlansService.updateWorkoutPlan(planId, submissionData);
            alert('Workout plan updated successfully');
            navigate(-1); // Navigate back to the previous page 
        } catch (err) {
            setError(err.message || 'An error occurred while updating the workout plan.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Workout Plan</h2>
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
            <button type="submit">Update Workout Plan</button>
        </form>
    );
};

export default UpdateWorkoutPlan;
