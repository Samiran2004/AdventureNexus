import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Hotel, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = await getToken();
                if (!token) return;

                const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/bookings/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status === "Ok") {
                    setBookings(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [getToken, VITE_BACKEND_URL]);

    return (
        <div className="min-h-screen bg-background">
            <NavBar />
            <div className="pt-32 pb-16 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 font-outfit">My Bookings</h1>

                {isLoading ? (
                    <div className="flex flex-col items-center py-20">
                        <Spinner className="size-12 text-primary" />
                        <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <Card key={booking._id} className="bg-card border-border overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/4 bg-muted/30 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r">
                                            {booking.type === 'Flight' ? (
                                                <Plane className="text-primary size-12 mb-2" />
                                            ) : (
                                                <Hotel className="text-primary size-12 mb-2" />
                                            )}
                                            <Badge variant="outline" className="mt-2 text-primary border-primary">
                                                {booking.type}
                                            </Badge>
                                            <p className="mt-4 text-2xl font-bold font-outfit">₹{booking.totalPrice}</p>
                                        </div>

                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-1">
                                                        {booking.type === 'Flight'
                                                            ? booking.referenceId?.airline || 'Flight Booking'
                                                            : booking.referenceId?.hotel_name || 'Hotel Booking'}
                                                    </h2>
                                                    <p className="text-muted-foreground flex items-center gap-2">
                                                        <MapPin size={16} />
                                                        {booking.type === 'Flight'
                                                            ? `${booking.referenceId?.departure_airport || 'Origin'} → ${booking.referenceId?.arrival_airport || 'Destination'}`
                                                            : booking.referenceId?.location?.city || 'Destination'}
                                                    </p>
                                                </div>
                                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 px-3 py-1 border-green-500/20">
                                                    <CheckCircle size={14} className="mr-1" />
                                                    {booking.status}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="text-muted-foreground" size={20} />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold">Dates</p>
                                                        <p className="text-sm font-medium">
                                                            {new Date(booking.travelDates?.from).toLocaleDateString()}
                                                            {booking.travelDates?.to && ` - ${new Date(booking.travelDates.to).toLocaleDateString()}`}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Clock className="text-muted-foreground" size={20} />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold">Booking ID</p>
                                                        <p className="text-sm font-medium font-mono">{booking._id.substring(0, 10).toUpperCase()}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="text-muted-foreground" size={20} />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase font-bold">Details</p>
                                                        <p className="text-sm font-medium">
                                                            {booking.type === 'Flight'
                                                                ? `${booking.referenceId?.flight_number} • ${booking.paxCount} Pax`
                                                                : `${booking.roomId?.roomType} • ${booking.paxCount} Pax`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed">
                        <Plane className="size-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
                        <p className="text-muted-foreground">Start planning your next adventure to see your bookings here!</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyBookingsPage;
