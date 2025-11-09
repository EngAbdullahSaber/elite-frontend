import React from 'react';
import Popup from './Popup';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title = 'تأكيد الإجراء',
    message = 'هل أنت متأكد أنك تريد إلغاء الحجز؟',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Popup show={open} onClose={onCancel}>
            <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
            <p className="text-sm text-gray-600 text-center">{message}</p>
            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    إلغاء
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                    تأكيد الإلغاء
                </button>
            </div>
        </Popup>
    );
}
