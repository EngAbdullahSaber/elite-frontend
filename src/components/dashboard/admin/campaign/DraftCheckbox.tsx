'use client';

import React from 'react';

type DraftCheckboxProps = {
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
};

export function DraftCheckbox({ name, checked, onChange, label = 'حفظ كمسودة' }: DraftCheckboxProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                className="accent-[var(--primary)] scale-125"
                id={`${name}-checkbox`}
                type="checkbox"
                name={name}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <label
                className="inline-block text-lg font-medium cursor-pointer"
                htmlFor={`${name}-checkbox`}
            >
                {label}
            </label>
        </div>
    );
}
