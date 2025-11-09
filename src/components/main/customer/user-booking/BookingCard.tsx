import React from 'react';
import { FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import Link from 'next/link';
import { Booking } from '@/types/global';
import Image from 'next/image';
import { bookingStatusMap } from '@/constants/dashboard/admin/appointment/contants';
import CancelBookingButton from './CancelBookingButton';
import StarRating from '@/components/shared/StarRating';
import ReviewBookingButton from './ReviewBookingButton';
import { formatDate, formatTime } from '@/utils/date';

interface BookingCardProps {
    booking: Booking;
    onCancel?: (id: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
    const status = bookingStatusMap[booking.status]
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-md p-5 space-y-4">
            {/* صورة العقار */}
            <div className="flex gap-4 items-center">
                <Image
                    src={booking.propertyImage}
                    alt={booking.propertyName}
                    height={20}
                    width={20}
                    className="w-20 h-20 rounded-xl object-cover border"
                />
                <div className='flex-grow flex flex-col sm:flex-row items-start sm:items-center  '>
                    <div className="flex-grow">
                        <Link href={`/projects/${booking.id}`} className="text-lg font-bold text-primary hover:underline">
                            {booking.propertyName}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{booking.propertyType}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-semibold">
                        {status}
                    </span>
                </div>
            </div>

            {/* تفاصيل الحجز */}
            <div className="flex flex-col md:flex-row flex-wrap  gap-2 lg:gap-6 xl:gap-10 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>
                        تاريخ الحجز: {formatDate(booking.startDate)} — {formatTime(booking.startDate)} - {formatTime(booking.endDate)}
                    </span>
                </div>

                {booking.agent && (
                    <div className="flex items-center gap-2">
                        <FaUserTie />
                        <span>الوسيط: {booking.agent}</span>
                    </div>
                )}
            </div>


            {/* إجراء */}
            {![bookingStatusMap.completed, bookingStatusMap.cancelled, bookingStatusMap.no_show].includes(status) && <div className="text-end">
                <CancelBookingButton bookingId={booking.id} onCancel={() => onCancel?.(booking.id)} />
            </div>}
            {booking.review ? (
                <div className="pt-4 space-y-2">
                    <StarRating value={booking.review.rating} />
                    <p className="text-sm text-gray-700">{booking.review.comment}</p>
                </div>
            ) : booking.status === 'completed' ? (
                <ReviewBookingButton bookingId={booking.id} />
            ) : null}
        </div>
    );
}
