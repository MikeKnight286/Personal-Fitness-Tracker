import axios from 'axios';

const API_URL = 'http://localhost:3001/api/activities/';

class ActivityService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: API_URL,
        });
    }

    async getAllActivities() {
        try {
            const response = await this.apiClient.get('all-activities');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch activities');
        }
    }

    async getActivityById(id) {
        try {
            const response = await this.apiClient.get(`activity/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch activity');
        }
    }

    async createActivity(activityData) {
        try {
            const response = await this.apiClient.post('create-activity', activityData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create activity');
        }
    }

    async addUserActivity(userActivityData) {
        try {
            const response = await this.apiClient.post('add-user-activity', userActivityData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to add user activity');
        }
    }

    async getUserActivities(userId) {
        try {
            const response = await this.apiClient.get(`user-activities/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch user activities');
        }
    }
}

const activityService = new ActivityService();
export default activityService;
