import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CreateWorkoutPlan from '../components/WorkoutPlan/CreateWorkoutPlan';
import WorkoutPlansList from '../components/WorkoutPlan/WorkoutPlansList';

const WorkoutPlanPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect non-authenticated users to the login page
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Workout Plan</h1>
            {user && (
                <>
                    {user.isAdmin && <CreateWorkoutPlan />}
                    <WorkoutPlansList/>
                </>
            )}
        </div>
    );
};

export default WorkoutPlanPage;