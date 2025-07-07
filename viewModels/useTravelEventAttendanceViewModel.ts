import { getTravelEventBookings, TravelEventBooking, updateTravelEventBookingAttendance } from '@/models/firestoreEventModel';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export const useTravelEventAttendanceViewModel = (eventId: string) => {
    const [bookings, setBookings] = useState<TravelEventBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingData = await getTravelEventBookings(eventId);
                const enriched = bookingData.map(booking => ({
                    ...booking,
                    attended: booking.attended ?? false,
                    seatsAttended: booking.seatsAttended,
                }));
                setBookings(enriched);
            } catch (err) {
                console.error(err);
                setError('Failed to load attendance data');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [eventId]);

    const toggleAttendance = (index: number) => {
        setBookings(prev =>
            prev.map((booking, i) =>
                i === index
                ? {
                    ...booking,
                    attended: !booking.attended,
                    seatsAttended:
                    !booking.attended && (booking.seatsAttended === undefined || booking.seatsAttended === 0)
                        ? booking.seatsBooked
                        : booking.seatsAttended,
                }
                : booking
            )
        );
    };

    const updateSeatsAttended = (index: number, value: number) => {
        setBookings(prev =>
            prev.map((booking, i) => (
                i === index ? { ...booking, seatsAttended: value } : booking
            ))
        );
    };

    const handleSaveAttendance = async () => {
        try {
            setLoading(true);
            await Promise.all(
            bookings
                .filter((booking) => booking.attended) // only include attended
                .map((booking) =>
                    updateTravelEventBookingAttendance(eventId, booking.id!, {
                        attended: true,
                        seatsAttended: booking.seatsAttended ?? booking.seatsBooked,
                    })
                )
            );
            router.back();
        } catch (err) {
            console.error(err);
            setError('Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    return {
        bookings,
        loading,
        error,
        toggleAttendance,
        updateSeatsAttended,
        handleSaveAttendance,
    };
};