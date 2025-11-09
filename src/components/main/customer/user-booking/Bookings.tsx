'use client';

import React, { useState } from 'react';
import BookingList from './BookingList';
import { Booking, BookingStatus } from '@/types/global';
const initialBookings: Booking[] = [
    {
        id: '1',
        status: 'confirmed',
        propertyName: 'مشروع فلل إيليت الماسية قيمة العقار',
        propertyType: 'شقة فيلا ارض',
        propertyImage: '/main/projects/property-1.webp',
        startDate: '2025-09-20T09:00:00',
        endDate: '2025-09-20T11:00:00',
        agent: 'محمد عبد الله',
        propertyLink: '/projects/elite-villa',
    },
    {
        id: '2',
        status: 'pending',
        propertyName: 'مشروع أبراج النخبة',
        propertyType: 'شقة',
        propertyImage: '/main/projects/property-2.webp',
        startDate: '2025-10-01T14:30:00',
        endDate: '2025-10-01T16:30:00',
        propertyLink: '/projects/nokhba-towers',
    },
    {
        id: '3',
        status: 'completed',
        propertyName: 'مجمع فلل المرجان',
        propertyType: 'فيلا',
        propertyImage: '/main/projects/property-3.webp',
        startDate: '2025-11-10T08:00:00',
        endDate: '2025-11-10T10:00:00',
        agent: 'سارة منصور',
        propertyLink: '/projects/murjan-villas',
    },
    {
        id: '4',
        status: 'in_progress',
        propertyName: 'أرض النخيل الاستثمارية',
        propertyType: 'ارض',
        propertyImage: '/main/projects/property-4.webp',
        startDate: '2025-12-01T17:00:00',
        endDate: '2025-12-01T19:00:00',
        agent: 'خالد يوسف',
        propertyLink: '/projects/palm-land',
    },
    {
        id: '5',
        status: 'completed',
        propertyName: 'مشروع شقق الواجهة البحرية',
        propertyType: 'شقة',
        propertyImage: '/main/projects/property-5.webp',
        startDate: '2025-08-01T15:00:00',
        endDate: '2025-08-01T18:00:00',
        agent: 'ليلى أحمد',
        propertyLink: '/projects/seafront-apartments',
        review: {
            comment: 'إقامة رائعة وموقع ممتاز على البحر. الخدمة كانت ممتازة والوسيط كان متعاون جداً.',
            rating: 5,
        },
    },
    {
        id: '6',
        status: 'cancelled',
        propertyName: 'مشروع فلل الواحة',
        propertyType: 'فيلا',
        propertyImage: '/main/projects/property-6.webp',
        startDate: '2025-07-15T10:30:00',
        endDate: '2025-07-15T12:30:00',
        propertyLink: '/projects/oasis-villas',
    },
    {
        id: '7',
        status: 'cancelled',
        propertyName: 'أرض التلال الذهبية',
        propertyType: 'ارض',
        propertyImage: '/main/projects/property-7.webp',
        startDate: '2025-06-10T13:00:00',
        endDate: '2025-06-10T15:00:00',
        agent: 'نادر فؤاد',
        propertyLink: '/projects/golden-hills',
    },
];


export default function Bookings() {
    const [activeTab, setActiveTab] = useState<BookingStatus>('pending');
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);

    const handleCancel = (id: string) => {
        console.log('canceled logic here')
    };

    const handleActiveTab = (tab: BookingStatus) => {
        setActiveTab(tab);
    };

    return (
        <BookingList
            bookings={bookings}
            activeTab={activeTab}
            onCancel={handleCancel}
            onTabChange={handleActiveTab}
        />
    );
}
