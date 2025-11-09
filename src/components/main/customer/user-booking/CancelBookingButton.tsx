import ConfirmDialog from '@/components/shared/ConfirmDialog';
import React, { useState } from 'react';


interface CancelBookingButtonProps {
    bookingId: string;
    onCancel: () => void;
}

export default function CancelBookingButton({ bookingId, onCancel }: CancelBookingButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="text-end">
            <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
            >
                إلغاء الحجز
            </button>

            <ConfirmDialog
                open={showConfirm}
                onConfirm={() => {
                    onCancel();
                    setShowConfirm(false);
                }}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}
