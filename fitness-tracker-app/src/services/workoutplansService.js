import axios from 'axios';

const API_URL = 'http://localhost:3001/api/workoutplans/';

// Retrieve the auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

class WorkoutPlansService {
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

    async getAllWorkoutPlans() {
        const response = await this.apiClient.get('');
        return response.data;
    }

    async getWorkoutPlanById(planId) {
        const response = await this.apiClient.get(`${planId}`);
        return response.data;
    }

    async createWorkoutPlan(workoutPlanData) {
        const response = await this.apiClient.post('', workoutPlanData);
        return response.data;
    }

    async updateWorkoutPlan(planId, workoutPlanData) {
        const response = await this.apiClient.put(`${planId}`, workoutPlanData);
        return response.data;
    }

    async deleteWorkoutPlan(planId) {
        const response = await this.apiClient.delete(`${planId}`);
        return response.data;
    }
}

const workoutPlansService = new WorkoutPlansService();
export default workoutPlansService;
