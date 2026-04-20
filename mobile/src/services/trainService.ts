import api from './api';

export const trainService = {
    // GET search trains
    async searchTrains(token: string, params: { from: string; to: string; date: string }) {
        const res = await api.get('/trains/search', {
            params,
        });
        return res.data;
    },

    // POST book ticket
    async bookTicket(token: string, payload: any) {
        const res = await api.post('/trains/book', payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // GET user bookings
    async getMyBookings(token: string) {
        const res = await api.get('/trains/bookings/mine', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // DELETE cancel booking
    async cancelBooking(token: string, bookingId: string) {
        const res = await api.delete(`/trains/bookings/${bookingId}/cancel`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // GET train schedule
    async getTrainSchedule(trainNumber: string) {
        const res = await api.get(`/trains/schedule/${trainNumber}`);
        return res.data;
    },

    // GET train live status
    async getTrainStatus(trainNumber: string) {
        const res = await api.get(`/trains/status/${trainNumber}`);
        return res.data;
    }
};
