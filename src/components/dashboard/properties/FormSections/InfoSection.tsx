'use client';

import Card from '@/components/shared/Card';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { PropertyDetail } from '../PropertyForm';
import FieldErrorMessage from '@/components/shared/Forms/FieldErrorMessage';

type InfoSectionProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>; // قابل لإعادة الاستخدام
    title: string;
};

export default function InfoSection<T extends FieldValues>({ control, name, title }: InfoSectionProps<T>) {
    const [newLabel, setNewLabel] = useState('');
    const [newValue, setNewValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <Card title={title}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const details = field.value as Record<string, PropertyDetail>;
                    const hasDetails = details && Object.keys(details).length > 0;

                    const handleAdd = () => {
                        setError(null);

                        if (!newLabel.trim()) {
                            setError('الاسم مطلوب');
                            return;
                        }


                        if (!newValue.trim()) {
                            setError('القيمه مطلوبة');
                            return;
                        }

                        if (details[newLabel]) {
                            setError('هذه المعلومة موجودة بالفعل');
                            return;
                        }

                        field.onChange({
                            ...details,
                            [newLabel]: { name: newLabel, value: newValue },
                        });

                        setNewLabel('');
                        setNewValue('');
                    };

                    const handleRemove = (key: string) => {
                        const updated = { ...details };
                        delete updated[key];
                        field.onChange(updated);
                    };

                    const handleEdit = (key: string, updatedField: Partial<PropertyDetail>) => {
                        field.onChange({
                            ...details,
                            [key]: { ...details[key], ...updatedField },
                        });
                    };

                    return (
                        <section>
                            {hasDetails ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-[var(--neutral-700)]">
                                    {Object.entries(details).map(([key, { name, value }]) => (
                                        <li
                                            key={key}
                                            className="relative bg-white border border-[var(--border)] p-4 rounded-xl shadow-sm"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(key)}
                                                className="absolute top-3 right-3 hover:text-primary"
                                            >
                                                <IoMdClose />
                                            </button>
                                            <p className="font-semibold mb-1 mt-2">{name}</p>
                                            <p>{value}</p>
                                        </li>

                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[var(--neutral-700)] text-lg">
                                    لا توجد معلومات متاحة حالياً.
                                </p>
                            )}

                            {/* إضافة معلومة جديدة */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="الاسم"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="border rounded-md p-2"
                                />

                                <input
                                    type="text"
                                    placeholder="القيمة"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <FieldErrorMessage
                                errors={{ newLabel: error ? { message: error } : undefined }}
                                fieldName="newLabel"
                            />
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="mt-4 btn-primary px-4 py-2 rounded-full"
                            >
                                إضافة معلومة
                            </button>
                        </section>
                    );
                }}
            />
        </Card>
    );
}
