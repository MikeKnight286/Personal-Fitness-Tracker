const UserWorkoutPlans = require('../models/UserWorkoutPlans');
const { userWorkoutPlanValidation, userWorkoutPlanUpdateValidation } = require('../validation/workoutplansValidation');

exports.addUserWorkoutPlan = async (req, res) => {
    const { error } = userWorkoutPlanValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const newUserWorkoutPlan = await UserWorkoutPlans.addUserWorkoutPlan(req.body);
        res.status(201).json(newUserWorkoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getUserWorkoutPlans = async (req, res) => {
    const userId = req.user.id;

    try {
        const workoutPlans = await UserWorkoutPlans.findByUserId(userId);
        res.json(workoutPlans);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateUserWorkoutPlanProgress = async (req, res) => {
    const { planId } = req.params;
    const userId = req.user.id; 
    const { error } = userWorkoutPlanUpdateValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
        const updatedUserWorkoutPlan = await UserWorkoutPlans.updateProgress(userId, planId, req.body);
        if (!updatedUserWorkoutPlan) {
            return res.status(404).send('User workout plan not found');
        }
        res.json(updatedUserWorkoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.removeUserWorkoutPlan = async (req, res) => {
    const { planId } = req.params;
    const userId = req.user.id;

    try {
        const deletedUserWorkoutPlan = await UserWorkoutPlans.removeUserWorkoutPlan(userId, planId);
        if (!deletedUserWorkoutPlan) {
            return res.status(404).send('User workout plan not found');
        }
        res.json(deletedUserWorkoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
