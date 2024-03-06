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
        console.error('Error adding diet entry:', error); // Debug inserting dietry data
        res.status(500).send(error.message);
    }
};

exports.updateDietEntry = async (req, res) => {
    console.log('Update diet req params:',req.params); // Chech req.params
    const { dietId } = req.params; // Diet id is passed in req.params

    // Validation
    const { error } = updateDietEntryValidation(req.body);
    if (error) {
        console.log('Validation error details:', error.details); // Log detailed validation errors
        return res.status(400).send({
            message: "Validation error",
            validation: error.details.map(detail => ({
                message: detail.message,
                path: detail.path,
                type: detail.type
            }))
        });
    }

    try {
        const updatedDietEntry = await Diet.updateDietEntry(dietId, req.body);
        if (!updatedDietEntry) {
            return res.status(404).send('Diet entry not found');
        }
        res.json(updatedDietEntry);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteDietEntry = async (req, res) => {
    const { dietId } = req.params;

    try {
        const deletedDietEntry = await Diet.deleteDietEntry(dietId);
        if (!deletedDietEntry) {
            return res.status(404).send('Diet entry not found');
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).send(error.message);
    }
};
