import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users/';

class AuthService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: API_URL,
        });

        this.apiClient.interceptors.request.use(config => {
            const userItem = localStorage.getItem('user');
            console.log('Raw user item from localStorage:', userItem); // Should show a string or null
        
            const token = userItem ? JSON.parse(userItem).token : undefined;
            console.log('Retrieved token from localStorage', token); // Should show the token or undefined
        
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
        
        
    }

    // Helper method to handle setting and clearing session data
    setSession(authData = null) {
        if (authData && authData.token) {
            // Debugging localStorage
            console.log('Storing token in localStorage', authData.token);

            localStorage.setItem('user', JSON.stringify(authData));
            this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
        } else {
            console.log('Clearing session from localStorage');
            localStorage.removeItem('user');
            delete this.apiClient.defaults.headers.common['Authorization'];
        }
    }

    // Fetches the current user from localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Registers a new user and sets session if successful
    async register(userData) {
        const response = await this.apiClient.post('register', userData);
        if (response.data.token) {
            this.setSession(response.data);
        }
        return response.data;
    }

    // Logs in a user and sets session
    async login(credentials) {
        const response = await this.apiClient.post('login', credentials);
        if (response.data && response.data.token) {
            console.log('Login successful with token:', response.data.token);
            const sessionData = { 
                token: response.data.token, 
                userId: response.data.userId,
                isAdmin: response.data.isAdmin
            };
            this.setSession(sessionData);
        } else {
            console.error('Login response did not contain a token.');
        }
        return response.data; // Adjusted to return the entire auth data
    }

    // Logs out the current user by clearing the session
    logout() {
        this.setSession();
    }

    // Initiates a password reset request
    async passwordResetRequest(email) {
        const response = await this.apiClient.post('reset-request', { email });
        return response.data;
    }

    // Completes the password reset process
    async resetPassword(token, newPassword) {
        const response = await this.apiClient.post('reset-password', { token, newPassword });
        return response.data;
    }
}

const authService = new AuthService();
export default authService;
