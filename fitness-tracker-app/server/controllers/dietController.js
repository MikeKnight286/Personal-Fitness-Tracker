const Diet = require('../models/Diet');
const { addDietEntryValidation, updateDietEntryValidation } = require('../validation/dietValidation'); 

exports.getUserDiets = async (req, res) => {
    const userId = req.user.id; 
    try {
        const diets = await Diet.findDietEntriesByUserId(userId);
        res.json(diets);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.addDietEntry = async (req, res) => {
    const userId = req.user.id; // Use authenticated user's ID

    // Validation 
    const { error } = addDietEntryValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const dietData = { userId, ...req.body };
        const newDietEntry = await Diet.addDietEntry(dietData);
        res.status(201).json(newDietEntry);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateDietEntry = async (req, res) => {
    const { id } = req.params; // Diet id is passed in req.params

    // Validation
    const { error } = updateDietEntryValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const updatedDietEntry = await Diet.updateDietEntry(id, req.body);
        if (!updatedDietEntry) {
            return res.status(404).send('Diet entry not found');
        }
        res.json(updatedDietEntry);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteDietEntry = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDietEntry = await Diet.deleteDietEntry(id);
        if (!deletedDietEntry) {
            return res.status(404).send('Diet entry not found');
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).send(error.message);
    }
};
