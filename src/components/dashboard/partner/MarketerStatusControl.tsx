'use client';

import { useState } from 'react';
import Popup from '@/components/shared/Popup';
import MarketerStatusToggle from './MarketerStatusToggle';
import { MarketerRow, MarketerStatus } from '@/types/dashboard/marketer';
import { marketerStatusClassMap } from '@/constants/dashboard/admin/marketers/contants';

type Props = {
    currentStatus: MarketerStatus;
    marketer: MarketerRow;
};

export default function MarketerStatusControl({ currentStatus, marketer }: Props) {
    const [showPopup, setShowPopup] = useState(false);
    const [nextStatus, setNextStatus] = useState<MarketerStatus>('active');

    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className={`mt-6 w-full px-4 py-2 rounded-md text-white font-semibold transition ${marketerStatusClassMap[currentStatus === 'suspended' ? 'active' : 'suspended']
                    }`}
            >
                {currentStatus === 'suspended' ? 'تفعيل الحساب' : 'تعليق الحساب'}
            </button>

            <Popup show={showPopup} onClose={() => setShowPopup(false)}>
                <MarketerStatusToggle
                    marketer={marketer}
                    currentStatus={currentStatus}
                    nextStatus={nextStatus}
                    onConfirm={() => setShowPopup(false)}
                    onCancel={() => setShowPopup(false)}
                />
            </Popup>
        </>
    );
}
