'use client';

import { useState } from 'react';
import Popup from '@/components/shared/Popup';
import AppointmentStatusToggle from './AppointmentStatusToggle';
import { BookingStatus } from '@/types/global';

type Props = {
    appointmentId: number;
    currentStatus: BookingStatus;
};

export default function AppointmentStatusControl({ appointmentId, currentStatus }: Props) {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)] w-full"
            >
                تغيير حالة الموعد
            </button>

            <Popup show={showPopup} onClose={() => setShowPopup(false)}>
                <AppointmentStatusToggle
                    appointmentId={appointmentId}
                    currentStatus={currentStatus}
                    onConfirm={() => setShowPopup(false)}
                    onCancel={() => setShowPopup(false)}
                />
            </Popup>
        </>
    );
}
