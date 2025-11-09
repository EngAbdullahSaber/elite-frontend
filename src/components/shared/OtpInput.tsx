'use client';

import React, { useEffect, useRef } from 'react';

type OtpInputProps = {
    value: string;
    onChange: (val: string) => void;
    length?: number;
};

export default function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (index: number, digit: string) => {
        if (!/^\d?$/.test(digit)) return; // Only allow digits

        const newOtp = value.split('');
        newOtp[index] = digit;
        const updated = newOtp.join('');
        onChange(updated);

        if (digit && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = e.key;

        if (key === 'ArrowRight' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (key === 'ArrowLeft' && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        } else if (key === 'Backspace') {
            const newOtp = value.split('');
            newOtp[index] = '';
            onChange(newOtp.join(''));
            if (index > 0) inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className="col-span-12 flex gap-3 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}

                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            ))}
        </div>
    );
}
