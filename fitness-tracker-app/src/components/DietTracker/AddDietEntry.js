import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import dietService from '../../services/dietService';

const AddDietEntry = () => {
    const { user } = useAuth(); // Use useAuth hook to access the current user
    const [dietData, setDietData] = useState({
        food_name: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fats_g: '',
        fiber_g: '',
        sugar_g: '',
        sodium_mg: '',
        cholesterol_mg: '',
        serving_size: '',
        meal_date: '',
        meal_type: '',
        notes: ''
    });

    const handleChange = (e) => {
        setDietData({ ...dietData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formattedDietData = {
            ...dietData,
            calories: parseInt(dietData.calories, 10),
            protein_g: parseFloat(dietData.protein_g),
            carbs_g: parseFloat(dietData.carbs_g),
            fats_g: parseFloat(dietData.fats_g),
            fiber_g: dietData.fiber_g ? parseFloat(dietData.fiber_g) : null,
            sugar_g: dietData.sugar_g ? parseFloat(dietData.sugar_g) : null,
            sodium_mg: dietData.sodium_mg ? parseInt(dietData.sodium_mg, 10) : null,
            cholesterol_mg: dietData.cholesterol_mg ? parseInt(dietData.cholesterol_mg, 10) : null,
            serving_size: dietData.serving_size ? dietData.serving_size : null,
            meal_date: dietData.meal_date, 
            meal_type: dietData.meal_type ? dietData.meal_type : null,
            notes: dietData.notes ? dietData.notes : null,
        };
    
        try {
            if (user) {
                await dietService.addDietEntry({ userId: user.id, ...formattedDietData });
                alert('Diet entry added successfully');
                // Reset form after successful submission
                setDietData({
                    food_name: '',
                    calories: '',
                    protein_g: '',
                    carbs_g: '',
                    fats_g: '',
                    fiber_g: '',
                    sugar_g: '',
                    sodium_mg: '',
                    cholesterol_mg: '',
                    serving_size: '',
                    meal_date: '',
                    meal_type: '',
                    notes: ''
                });
            }
        } catch (error) {
            alert(`Failed to add diet entry: ${error.message}`);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Diet Entry</h2>
            <div>
                <label>Food Name:</label>
                <input name="food_name" value={dietData.food_name} onChange={handleChange} required />
            </div>
            <div>
                <label>Calories:</label>
                <input type="number" name="calories" value={dietData.calories} onChange={handleChange} required />
            </div>
            <div>
                <label>Protein (g):</label>
                <input type="number" name="protein_g" value={dietData.protein_g} onChange={handleChange} required />
            </div>
            <div>
                <label>Carbs (g):</label>
                <input type="number" name="carbs_g" value={dietData.carbs_g} onChange={handleChange} required />
            </div>
            <div>
                <label>Fats (g):</label>
                <input type="number" name="fats_g" value={dietData.fats_g} onChange={handleChange} required />
            </div>
            <div>
                <label>Fiber (g) (optional):</label>
                <input type="number" name="fiber_g" value={dietData.fiber_g} onChange={handleChange} placeholder="e.g., 5" />
            </div>
            <div>
                <label>Sugar (g) (optional):</label>
                <input type="number" name="sugar_g" value={dietData.sugar_g} onChange={handleChange} placeholder="e.g., 20" />
            </div>
            <div>
                <label>Sodium (mg) (optional):</label>
                <input type="number" name="sodium_mg" value={dietData.sodium_mg} onChange={handleChange} placeholder="e.g., 200" />
            </div>
            <div>
                <label>Cholesterol (mg) (optional):</label>
                <input type="number" name="cholesterol_mg" value={dietData.cholesterol_mg} onChange={handleChange} placeholder="e.g., 0" />
            </div>
            <div>
                <label>Serving Size (optional, e.g., "1 cup", "100g"):</label>
                <input
                    type="text"
                    name="serving_size"
                    value={dietData.serving_size}
                    onChange={handleChange}
                    placeholder="e.g., 1 cup, 100g"
                />
            </div>
            <div>
                <label>Meal Date:</label>
                <input type="date" name="meal_date" value={dietData.meal_date} onChange={handleChange} required />
            </div>
            <div>
                <label>Meal Type (optional):</label>
                <select name="meal_type" value={dietData.meal_type} onChange={handleChange}>
                    <option value="">Select a meal type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                </select>
            </div>
            <div>
                <label>Notes (optional):</label>
                <textarea name="notes" value={dietData.notes} onChange={handleChange} placeholder="Any additional information"/>
            </div>
            <button type="submit">Add Entry</button>
        </form>
    );
};

export default AddDietEntry;
