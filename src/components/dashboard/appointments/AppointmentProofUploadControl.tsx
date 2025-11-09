'use client';

import { useState } from 'react';
import Popup from '@/components/shared/Popup';
import AppointmentProofUploadToggle from './AppointmentProofUploadToggle';

type Props = {
    appointmentId: number;
    onUploaded?: (files: any[]) => void;
};

export default function AppointmentProofUploadControl({ appointmentId, onUploaded }: Props) {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)] w-full"
            >
                إرفاق مستندات الدفع
            </button>

            <Popup show={showPopup} onClose={() => setShowPopup(false)}>
                <AppointmentProofUploadToggle
                    appointmentId={appointmentId}
                    onConfirm={(files) => {
                        onUploaded?.(files);
                        setShowPopup(false);
                    }}
                    onCancel={() => setShowPopup(false)}
                />
            </Popup>
        </>
    );
}
