'use client';

import { useState } from 'react';
import PropertyFilterContent from './PropertyFilterContent';
import { PropertyType } from '@/types/property';

type Property = {
    id: string;
    title: string;
    imageLink: string;
    type: PropertyType;
};

type Props = {
    appointmentId?: number;
    properties: Property[];
    selectedProperty?: Property;
    label?: string;
    onConfirm?: (property: Property) => void;
    onCancel?: () => void;
};

export default function PropertyAssignmentToggle({
    appointmentId,
    properties,
    selectedProperty,
    label = 'العقار',
    onConfirm,
    onCancel,
}: Props) {
    const [selectedLocal, setSelectedLocal] = useState<Property | null>(null);
    const [loading, setLoading] = useState(false);

    const title = selectedProperty ? `اختر ${label} آخر` : `تعيين ${label}`;
    const message = appointmentId ? `اختر ${label} للموعد رقم ${appointmentId}.` : '';

    const handleAssign = async () => {
        if (!selectedLocal) return;

        if (!appointmentId) {
            onConfirm?.(selectedLocal);
            return;
        }

        setLoading(true);
        try {
            // await fetch(`/api/appointments/${appointmentId}/assign-property`, {
            //   method: 'PATCH',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ propertyId: selectedLocal.id }),
            // });

            onConfirm?.(selectedLocal);
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

            <PropertyFilterContent
                properties={properties}
                onSelect={(property) => setSelectedLocal(property)}
                label={label}
            />

            <div className="flex justify-end gap-3 pt-6">
                <button
                    onClick={() => onCancel?.()}
                    type="button"
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    إلغاء
                </button>
                <button
                    onClick={handleAssign}
                    disabled={!selectedLocal || loading}
                    type="button"
                    className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)]"
                >
                    {loading
                        ? 'جارٍ التنفيذ...'
                        : selectedLocal
                            ? `تأكيد التعيين لـ "${selectedLocal.title}"`
                            : `اختر ${label} أولاً`}
                </button>
            </div>
        </div>
    );
}
