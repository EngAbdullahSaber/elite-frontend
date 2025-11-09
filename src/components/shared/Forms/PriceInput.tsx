'use client';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import TextInput from '@/components/shared/Forms/TextInput';

type PriceInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
};

export default function PriceInput<T extends FieldValues>({
    control,
    name,
    label = 'سعر البيع',
    placeholder = 'أدخل السعر',
}: PriceInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextInput
                    id={name}
                    label={label}
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    value={
                        field.value !== undefined && field.value !== null
                            ? Number(field.value).toLocaleString('en-US')
                            : ''
                    }
                    onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, '');
                        const num = Number(raw);
                        if (!isNaN(num)) field.onChange(num);
                    }}
                />
            )}
        />
    );
}
