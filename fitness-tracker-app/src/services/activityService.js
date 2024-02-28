import axios from 'axios';

const API_URL = 'http://localhost:3001/api/activities/';

// Retrieve the auth token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

class ActivityService {
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

    async getAllActivities() {
        const response = await this.apiClient.get('all-activities');
        return response.data;
    }

    async getActivityById(id) {
        const response = await this.apiClient.get(`activity/${id}`);
        return response.data;
    }

    async createActivity(activityData) {
        const response = await this.apiClient.post('create-activity', activityData);
        return response.data;
    }

    async addUserActivity(userActivityData) {
        const response = await this.apiClient.post('add-user-activity', userActivityData);
        return response.data;
    }

    async getUserActivities(userId) {
        const response = await this.apiClient.get(`user-activities/${userId}`);
        return response.data;
    }
}

const activityService = new ActivityService();
export default activityService;
