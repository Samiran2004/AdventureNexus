import api from './api';

export const planService = {
    async getRandomPlans() {
        try {
            // Assuming there's a route for recent or popular plans
            // For now, using a placeholder or public plans
            const response = await api.get('/plans/recommendations');
            return response.data;
        } catch (error) {
            console.error('Error fetching plans:', error);
            throw error;
        }
    },

    async searchDestination(params: any) {
        try {
            const response = await api.post('/plans/search/destination', params);
            return response.data;
        } catch (error) {
            console.error('Error searching destination:', error);
            throw error;
        }
    },
};
