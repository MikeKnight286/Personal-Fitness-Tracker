const WorkoutPlans = require('../models/WorkoutPlans');
const { createWorkoutPlanValidation, updateWorkoutPlanValidation } = require('../validation/workoutplansValidation');

exports.getAllWorkoutPlans = async (req, res) => {
    try {
        const premiumOnly = req.query.premiumOnly === 'true';
        const workoutPlans = await WorkoutPlans.findAll({ premiumOnly });
        res.json(workoutPlans);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getWorkoutPlanById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const workoutPlan = await WorkoutPlans.findById(id);
        if (!workoutPlan) {
            return res.status(404).send('Workout plan not found');
        }
        res.json(workoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createWorkoutPlan = async (req, res) => {
    const { error } = createWorkoutPlanValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const newWorkoutPlan = await WorkoutPlans.create(req.body);
        res.status(201).json(newWorkoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateWorkoutPlan = async (req, res) => {
    const { error } = updateWorkoutPlanValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const id = parseInt(req.params.id);
        const updatedWorkoutPlan = await WorkoutPlans.update(id, req.body);
        if (!updatedWorkoutPlan) {
            return res.status(404).send('Workout plan not found');
        }
        res.json(updatedWorkoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteWorkoutPlan = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedWorkoutPlan = await WorkoutPlans.delete(id);
        if (!deletedWorkoutPlan) {
            return res.status(404).send('Workout plan not found');
        }
        res.json(deletedWorkoutPlan);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
