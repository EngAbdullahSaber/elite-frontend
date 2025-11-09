'use client';

import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import InfoCell from '@/components/shared/InfoCell';
import Popup from '@/components/shared/Popup';
import PropertyAssignmentToggle from './PropertyAssignmentToggle';
import { projectTypeColors } from '@/constants/dashboard/admin/property.tsx/constants';
import { PropertyType, propertyTypeLabels } from '@/types/property';
import { getDefaultProjectpath } from '@/utils/appointment';

type Property = {
    id: string;
    title: string;
    imageLink: string;
    type: PropertyType;
};

type Props = {
    appointmentId?: number;
    initialProperty?: Property;
    properties: Property[];
    label?: string;
    showSelected?: boolean;
    onChange?: (property?: Property) => void;
};

export default function PropertyChanger({
    appointmentId,
    initialProperty,
    properties,
    label = 'العقار',
    showSelected = true,
    onChange,
}: Props) {
    const [property, setProperty] = useState<Property | undefined>(initialProperty);
    const [showPopup, setShowPopup] = useState(false);

    const handleSelect = (newProperty: Property) => {
        setProperty(newProperty);
        setShowPopup(false);
        onChange?.(newProperty);
    };

    const handleCancel = () => {
        setProperty(undefined);
        setShowPopup(false);
        onChange?.(undefined);
    };

    return (
        <div className="relative w-full">
            {!property || !showSelected ? (
                <button
                    onClick={() => setShowPopup(true)}
                    type="button"
                    className="w-full py-3 px-4 border font-semibold rounded-md hover:bg-gray-100 transition"
                >
                    {property ? `اختر ${label} آخر` : `تعيين ${label}`}
                </button>
            ) : (
                <div className="relative flex items-center gap-2 border p-2 rounded-md bg-white">
                    <div className="flex gap-2">
                        <InfoCell
                            title={property.title}
                            image={property.imageLink}
                            defaultImage={getDefaultProjectpath(property.type)}
                            href={`/projects/${property.id}`}
                            imageRounded="lg"
                            subtitleClass={projectTypeColors[property.type]}
                            subtitle={propertyTypeLabels[property.type]}
                        />
                        <button
                            onClick={handleCancel}
                            type="button"
                            title="إزالة"
                            className="text-gray-500 hover:text-red-500 p-2 rounded-full"
                        >
                            <MdClose className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="mr-auto px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] min-w-[110px] text-center"
                    >
                        تغيير {label}
                    </button>
                </div>
            )
            }

            <Popup show={showPopup} onClose={() => setShowPopup(false)}>
                <PropertyAssignmentToggle
                    appointmentId={appointmentId}
                    properties={properties}
                    selectedProperty={property}
                    label={label}
                    onConfirm={handleSelect}
                    onCancel={handleCancel}
                />
            </Popup>
        </div >
    );
}
