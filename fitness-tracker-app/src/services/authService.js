import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users/';

class AuthService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: API_URL,
        });
    }

    async register(userData) {
        const response = await this.apiClient.post('register', userData);
        return response.data;
    }

    async login(credentials) {
        const response = await this.apiClient.post('login', credentials);
        if (response.data.token) {
            this.setSession(response.data);
        }
        return response.data;
    }

    async passwordResetRequest(email) {
        const response = await this.apiClient.post('reset-request', { email });
        return response.data;
    }

    async resetPassword(token, newPassword) {
        const response = await this.apiClient.post('reset-password', { token, newPassword });
        return response.data;
    }

    logout() {
        this.setSession(null);
    }

    setSession(authData) {
        if (authData) {
            localStorage.setItem('user', JSON.stringify(authData));
            this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
        } else {
            localStorage.removeItem('user');
            delete this.apiClient.defaults.headers.common['Authorization'];
        }
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            return null;
        }
        return JSON.parse(userStr);
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
