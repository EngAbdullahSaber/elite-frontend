'use client';

import { useState } from 'react';
import UserFilterContent from './UserFilterContent';

type User = {
    id: number;
    name: string;
    email: string;
    image?: string;
};

type Props = {
    appointmentId?: number;
    users: User[];
    selectedUser?: User;
    label?: string;
    onConfirm?: (user: User) => void;
    onCancel?: () => void;
};

export default function UserAssignmentToggle({
    appointmentId,
    users,
    selectedUser,
    label = 'المستخدم',
    onConfirm,
    onCancel,
}: Props) {
    const [selectedUserLocal, setSelectedUserLocal] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const title = selectedUser ? `اختر ${label} اخر` : `تعيين ${label}`;
    const message = appointmentId ? `اختر ${label} للموعد رقم ${appointmentId}.` : '';

    const handleAssign = async () => {
        if (!selectedUserLocal) return;

        if (!appointmentId) {
            onConfirm?.(selectedUserLocal);
            return;
        }

        setLoading(true);
        try {
            // await fetch(`/api/appointments/${appointmentId}/assign`, {
            //   method: 'PATCH',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ userId: selectedUserLocal.id }),
            // });

            onConfirm?.(selectedUserLocal);
        } catch (error) {
            console.error(`فشل في تعيين ${label}:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg bg-white max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
            {message && <p className="text-sm text-gray-600 text-center mb-4">{message}</p>}

            <UserFilterContent
                users={users}
                onSelect={(user) => setSelectedUserLocal(user)}
                label={label}
            />

            <div className="flex justify-end gap-3 pt-6">
                <button
                    onClick={() => onCancel?.()}
                    type='button'
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    إلغاء
                </button>
                <button
                    onClick={handleAssign}
                    disabled={!selectedUserLocal || loading}
                    type='button'
                    className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)]"
                >
                    {loading
                        ? 'جارٍ التنفيذ...'
                        : selectedUserLocal
                            ? `تأكيد التعيين لـ "${selectedUserLocal.name}"`
                            : `اختر ${label} أولاً`}
                </button>
            </div>
        </div>
    );
}
