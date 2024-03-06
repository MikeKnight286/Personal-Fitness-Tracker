import axios from 'axios';

const API_URL = 'http://localhost:3001/api/diets/';

// Retrieve the auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

class DietService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: API_URL,
        });

        // Attach the authorization token to every request using an interceptor
        this.apiClient.interceptors.request.use(config => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, error => Promise.reject(error));
    }

    async getUserDiets(userId) {
        const response = await this.apiClient.get(`user-diets/${userId}`);
        return response.data;
    }

    async addDietEntry(dietData) {
        const response = await this.apiClient.post('user-diets', dietData);
        return response.data;
    }

    async getDietEntryById(dietId) {
        const response = await this.apiClient.get(`user-diets/${dietId}`);
        return response.data;
    }
    
    async updateDietEntry(dietId, dietData) {
        const response = await this.apiClient.put(`user-diets/${dietId}`, dietData);
        return response.data;
    }

    async deleteDietEntry(dietId) {
        const response = await this.apiClient.delete(`user-diets/${dietId}`);
        return response.data;
    }
}

const dietService = new DietService();
export default dietService;
