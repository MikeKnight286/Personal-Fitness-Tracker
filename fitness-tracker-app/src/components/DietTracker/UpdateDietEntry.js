import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dietService from '../../services/dietService';

const UpdateDietEntry = () => {
    const { dietId } = useParams();
    const navigate = useNavigate();
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
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = `${date.getMonth() + 1}`;
        let day = `${date.getDate()}`;
    
        // Pad the month and day with leading zeros if necessary
        month = month.length < 2 ? `0${month}` : month;
        day = day.length < 2 ? `0${day}` : day;
    
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {   
        const fetchDietEntry = async () => {
            try {
                const data = await dietService.getDietEntryById(dietId);
                if (data && data.length > 0) {
                    const entry = data[0]; // grab the first element of data object
                    if (entry && entry.meal_date) {
                        entry.meal_date = formatDate(entry.meal_date);
                    }
                    setDietData(entry); 
                    setLoading(false);
                } else {
                    setError('No diet entry found.');
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch diet entry.');
                setLoading(false);
            }
        };
        fetchDietEntry();
    }, [dietId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDietData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Removed id, user_id, created_at, updated_at as it is not required in res.body
        const { id, user_id, created_at, updated_at, ...formattedDietData }  = {
            ...dietData,
            food_name: dietData.food_name,
            calories: parseInt(dietData.calories, 10),
            protein_g: parseFloat(dietData.protein_g),
            carbs_g: parseFloat(dietData.carbs_g),
            fats_g: parseFloat(dietData.fats_g),
            fiber_g: dietData.fiber_g ? parseFloat(dietData.fiber_g) : null,
            sugar_g: dietData.sugar_g ? parseFloat(dietData.sugar_g) : null,
            sodium_mg: dietData.sodium_mg ? parseInt(dietData.sodium_mg, 10) : null,
            cholesterol_mg: dietData.cholesterol_mg ? parseInt(dietData.cholesterol_mg, 10) : null,
            serving_size: dietData.serving_size || null,
            meal_date: dietData.meal_date, 
            meal_type: dietData.meal_type || null,
            notes: dietData.notes || null,
        };
        
        try {
            await dietService.updateDietEntry(dietId, formattedDietData);
            alert('Diet entry updated successfully');
            navigate(-1); // Navigate back to the previous page or to a specific route
        } catch (err) {
            setError(err.message || 'An error occurred while updating the diet entry.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Diet Entry</h2>
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
                <input type="number" name="cholesterol_mg" value={dietData.cholesterol_mg}  onChange={handleChange} placeholder="e.g., 0" />
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
            <button type="submit">Update Entry</button>
        </form>
    );
};

export default UpdateDietEntry;