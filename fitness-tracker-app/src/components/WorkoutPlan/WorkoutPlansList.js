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
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Target Goal</th>
                            <th>Difficulty</th>
                            <th>Duration (Weeks)</th>
                            <th>Sessions/Week</th>
                            <th>Type</th>
                            <th>Video URL</th>
                            <th>Prerequisites</th>
                            <th>Tags</th>
                            {user && user.isAdmin === true && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {workoutPlans.map((plan) => (
                            <tr key={plan.id || plan.name}>
                                <td>{plan.name}</td>
                                <td>{plan.description}</td>
                                <td>{plan.target_goal}</td>
                                <td>{plan.difficulty_level}</td>
                                <td>{plan.duration_weeks}</td>
                                <td>{plan.sessions_per_week}</td>
                                <td>{plan.premium_only ? 'Premium' : 'Free'}</td>
                                <td><a href={plan.video_url} target="_blank" rel="noopener noreferrer">View</a></td>
                                <td>{plan.prerequisites}</td>
                                <td>{plan.tags.join(', ')}</td>
                                {user && user.isAdmin === true && (
                                    <td>
                                        <button onClick={() => handleDelete(plan.id)}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No workout plans found.</p>
            )}
        </div>
    );
};

export default WorkoutPlansList;
