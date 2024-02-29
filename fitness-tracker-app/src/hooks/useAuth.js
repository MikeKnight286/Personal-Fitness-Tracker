import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);

