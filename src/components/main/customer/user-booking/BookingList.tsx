import React, { useMemo } from 'react';
import BookingCard from './BookingCard';
import { Booking, BookingStatus } from '@/types/global';
import Card from '@/components/shared/Card';
import { bookingStatusMap } from '@/constants/dashboard/admin/appointment/contants';

interface BookingListProps {
    bookings: Booking[];
    activeTab: string;
    onCancel?: (id: string) => void;
    onTabChange?: (tab: BookingStatus) => void;
}

export default function BookingList({
    bookings,
    activeTab,
    onCancel,
    onTabChange,
}: BookingListProps) {
    const filtered = bookings.filter((b) => {
        return b.status == activeTab;
    });
    const taps = useMemo<[BookingStatus, string][]>(
        () => Object.entries(bookingStatusMap) as [BookingStatus, string][],
        []
    );
    return (
        <Card title='حجوزاتي' hasMinHeight={true}>
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 border-b mb-4">
                {taps.map((tab) => (
                    <button
                        key={tab[1]}
                        onClick={() => onTabChange?.(tab[0])}
                        className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === tab[0] ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'
                            }`}
                    >
                        {tab[1]}
                    </button>
                ))}
            </div>

            {/* Bookings */}
            <div className="space-y-4">
                {filtered.length > 0 ? (
                    filtered.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-10">لا توجد حجوزات في هذا القسم حالياً.</p>
                )}
            </div>
        </Card>
    );
}
