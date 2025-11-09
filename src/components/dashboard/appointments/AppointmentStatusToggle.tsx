'use client'
import SelectDropdown from "@/components/shared/Forms/SelectDropdown";
import { bookingStatusMap, bookingStatusStyle } from "@/constants/dashboard/admin/appointment/contants";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { BookingStatus } from "@/types/global";
import { useState, useMemo } from "react";

type Props = {
    appointmentId: number;
    currentStatus: BookingStatus;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export default function AppointmentStatusToggle({
    appointmentId,
    currentStatus,
    onConfirm,
    onCancel,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(currentStatus);

    const handleChange = (value: string) => {
        setSelectedStatus(value as BookingStatus);
    };

    const handleToggle = async () => {
        setLoading(true);
        try {
            await fetch(`/api/appointments/${appointmentId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: selectedStatus }),
            });

            if (onConfirm) onConfirm();
        } catch (error) {
            console.error("Failed to update appointment status:", error);
        } finally {
            setLoading(false);
        }
    };

    const title = "تغيير حالة الموعد";
    const message = `اختر الحالة الجديدة للموعد رقم ${appointmentId}.`;
    const style = currentStatus ? bookingStatusStyle[currentStatus] : 'bg-gray-100 text-gray-500';

    const role = useRoleFromPath();


    const statusOptions = useMemo(() => {
        const allOptions = Object.entries(bookingStatusMap).map(([value, label]) => ({
            value,
            label,
        }));

        if (role === 'agent') {
            // Remove 'pending', 'assigned', 'confirmed'
            return allOptions.filter(
                (option) =>
                    option.value !== 'pending' &&
                    option.value !== 'assigned' &&
                    option.value !== 'confirmed'
            );
        }

        return allOptions;
    }, [role]);
    return (
        <div className="rounded-lg bg-white max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
            <p className="text-sm text-gray-600 text-center mb-4">{message}
                <span className={`${style} !bg-white`}> الحالة الحالية هي {bookingStatusMap[currentStatus]}</span>
            </p>

            <SelectDropdown
                options={statusOptions}
                value={selectedStatus}
                onChange={handleChange}
                label="الحالة الجديدة"
            />

            <div className="flex justify-end gap-3 pt-6">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    إلغاء
                </button>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)]"
                >
                    {loading ? "جارٍ التنفيذ..." : `تأكيد التغيير إلى "${bookingStatusMap[selectedStatus]}"`}
                </button>
            </div>
        </div>
    );
}
