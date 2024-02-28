import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Update the import path as needed

export const useAuth = () => useContext(AuthContext);

