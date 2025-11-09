'use client';

import { useState } from 'react';
import InfoCell from '../shared/InfoCell';
import Popup from '../shared/Popup';
import { MdClose } from 'react-icons/md';
import UserAssignmentToggle from './UserAssignmentToggle';

type User = {
    id: number;
    name: string;
    email: string;
    image?: string;
};

type Props = {
    appointmentId?: number;
    initialUserId?: number;
    users: User[];
    label?: string;
    showSelected?: boolean;
    onChange?: (user?: User) => void;
};

export default function UserChanger({
    appointmentId,
    initialUserId,
    users,
    label = 'المستخدم',
    showSelected = true,
    onChange
}: Props) {
    const [user, setUser] = useState<User | undefined>(() => users.find((u) => u.id === initialUserId));
    const [showPopup, setShowPopup] = useState(false);

    const handleSelect = (newUser: User) => {
        setUser(newUser);
        setShowPopup(false);
        onChange?.(newUser); // ✅ notify parent
    };

    const handleCancel = () => {
        setUser(undefined);
        setShowPopup(false);
        onChange?.(undefined); // ✅ notify parent
    }

    return (
        <div className="relative w-full">
            {/* ✅ عرض المستخدم الحالي أو زر التعيين */}
            {!user || !showSelected ? (
                <button
                    onClick={() => setShowPopup(true)}
                    type='button'
                    className="w-full py-3 px-4 border font-semibold rounded-md hover:bg-gray-100 transition"
                >
                    {user ? `اختر ${label} آخر` : `تعيين ${label}`}
                </button>
            ) : (
                <div className="flex items-center gap-2 border p-2 rounded-md bg-white">
                    <div className="flex gap-2">
                        <InfoCell
                            image={user.image}
                            subtitle={user.email}
                            title={user.name}
                            href={`/dashboard/admin/${label === 'وسيط' ? 'agents' : 'clients'}/${user.id}`}
                            imageRounded="full"
                        />
                        <button
                            onClick={handleCancel}
                            type='button'
                            title="إزالة"
                            className="text-gray-500 hover:text-red-500 p-2 rounded-full"
                        >
                            <MdClose className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowPopup(true)}
                        type='button'
                        className="mr-auto px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] min-w-[110px] text-center"
                    >
                        تغيير {label}
                    </button>
                </div>
            )}

            {/* ✅ نافذة التعيين */}
            <Popup show={showPopup} onClose={() => setShowPopup(false)}>
                <UserAssignmentToggle
                    appointmentId={appointmentId}
                    users={users}
                    selectedUser={user}
                    label={label}
                    onConfirm={handleSelect}
                    onCancel={handleCancel}
                />
            </Popup>
        </div>
    );
}
