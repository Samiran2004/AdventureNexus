import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { experiencesService } from '../services/experiencesService';
import toast from 'react-hot-toast';

export const useBooking = () => {
    const [submitting, setSubmitting] = useState(false);
    const [bookingSuccessData, setBookingSuccessData] = useState(null);
    const { getToken } = useAuth();

    const makeReservation = async (experienceId, bookingDetails) => {
        setSubmitting(true);
        setBookingSuccessData(null);
        try {
            const token = await getToken();
            const res = await experiencesService.bookExperience(experienceId, bookingDetails, token);
            if (res.success) {
                setBookingSuccessData(res.data);
                toast.success('Your adventure has been securely reserved! 🚀');
                return { success: true, data: res.data };
            } else {
                throw new Error(res.message || 'Booking checkout failed');
            }
        } catch (err) {
            console.error('useBooking error:', err);
            const errMsg = err.message || 'Slots are fully occupied or system is offline.';
            toast.error(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setSubmitting(false);
        }
    };

    return {
        makeReservation,
        submitting,
        bookingSuccessData,
        clearBookingData: () => setBookingSuccessData(null)
    };
};
export default useBooking;
