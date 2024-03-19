import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthContext } from '../../context/AuthContext';
import workoutPlansService from '../../services/workoutplansService';

const WorkoutPlansList = () => {
    const { user } = useAuth(); // Using useAuth hook to access the current user's information
    const { loading: authLoading } = useContext(AuthContext); // Destructure loading state from AuthContext
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [premiumOnly, setPremiumOnly] = useState(false); // State to handle premium only filter

    useEffect(() => {
        if (!authLoading) {
            const fetchWorkoutPlans = async () => {
                try {
                    setLoading(true);
                    const data = await workoutPlansService.getAllWorkoutPlans(); // Fetch all workout plans
                    const filteredData = premiumOnly ? data.filter(plan => plan.premium_only) : data; // Apply premium only filter if needed
                    setWorkoutPlans(filteredData);
                    setLoading(false);
                } catch (err) {
                    setError(err.message || 'An error occurred while fetching workout plans.');
                    setLoading(false);
                }
            };

            fetchWorkoutPlans();
        }
    }, [authLoading, premiumOnly]); // Depend on the authentication loading state and premiumOnly state
    
    const handleDelete = async (planId) => {
        if (window.confirm('Are you sure you want to delete this workout plan?')) {
            try {
                await workoutPlansService.deleteWorkoutPlan(planId);
                setWorkoutPlans(workoutPlans.filter(plan => plan.id !== planId));
                alert('Workout plan deleted successfully.');
            } catch (err) {
                setError(err.message || 'An error occurred while deleting the workout plan.');
            }
        }
    };

    if (authLoading || loading) return <div>Loading workout plans...</div>; // Show loading indicator if either authLoading or loading is true
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Workout Plans List</h2>
            <label>
                <input
                    type="checkbox"
                    checked={premiumOnly}
                    onChange={() => setPremiumOnly(!premiumOnly)} // Toggle premium only filter
                />
                Show Premium Plans Only
            </label>
            {workoutPlans.length > 0 ? (
                <ul>
                    {workoutPlans.map((plan) => (
                        <li key={plan.name}>
                            {plan.name} - {plan.description}, Target Goal: {plan.target_goal}, Difficulty: {plan.difficulty_level}, Duration: {plan.duration_weeks} weeks, Sessions/Week: {plan.sessions_per_week}, {plan.premium_only ? 'Premium' : 'Free'}, Video URL: {plan.video_url}, Prerequisites: {plan.prerequisites}, Tags: {plan.tags.join(', ')}
                            {user && user.role === 'admin' && ( // Conditionally render the delete button for admin users
                                <button onClick={() => handleDelete(plan.id)}>Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No workout plans found.</p>
            )}
        </div>
    );
};

export default WorkoutPlansList;
