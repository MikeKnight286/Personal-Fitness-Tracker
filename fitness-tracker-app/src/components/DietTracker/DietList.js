import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import dietService from '../../services/dietService';

const DietList = () => {
    const { user } = useAuth(); // Using useAuth hook to access the current user's information
    const [diets, setDiets] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDiets = useCallback(async () => {
        if (user) {
            try {
                setLoading(true);
                const data = await dietService.getUserDiets(user.id);
                setDiets(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching diets.');
                setLoading(false);
            }
        }
    }, [user]);

    const deleteDietEntry = async (dietId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this diet entry?');
        if (confirmDelete) {
            try {
                await dietService.deleteDietEntry(dietId);
                // Refresh the list after delete
                fetchDiets();
            } catch (err) {
                setError(err.message || 'An error occurred while deleting the diet entry.');
            }
        }
    };

    useEffect(() => {
        fetchDiets();
    }, [fetchDiets]); // Fetch diets when the user info changes

    if (loading) return <div>Loading diets...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Your Diet Entries</h2>
            {diets.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Calories</th>
                            <th>Protein (g)</th>
                            <th>Carbs (g)</th>
                            <th>Fats (g)</th>
                            <th>Fiber (g)</th>
                            <th>Sugar (g)</th>
                            <th>Sodium (mg)</th>
                            <th>Cholesterol (mg)</th>
                            <th>Serving Size</th>
                            <th>Meal Date</th>
                            <th>Meal Type</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diets.map((diet) => (
                            <tr key={diet.id}>
                                <td>{diet.food_name}</td>
                                <td>{diet.calories}</td>
                                <td>{diet.protein_g}</td>
                                <td>{diet.carbs_g}</td>
                                <td>{diet.fats_g}</td>
                                <td>{diet.fiber_g || 'N/A'}</td>
                                <td>{diet.sugar_g || 'N/A'}</td>
                                <td>{diet.sodium_mg || 'N/A'}</td>
                                <td>{diet.cholesterol_mg || 'N/A'}</td>
                                <td>{diet.serving_size || 'N/A'}</td>
                                <td>{new Date(diet.meal_date).toLocaleDateString()}</td>
                                <td>{diet.meal_type || 'N/A'}</td>
                                <td>{diet.notes || 'N/A'}</td>
                                
                                {/*  Update Button */}
                                <td>
                                    <button onClick={() => navigate(`/diets/update/${diet.id}`)}>Update</button>
                                </td>
                                {/*  Delete Button */}
                                <td>
                                    <button onClick={() => deleteDietEntry(diet.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No diet entries found.</p>
            )}
        </div>
    );
};

export default DietList;
