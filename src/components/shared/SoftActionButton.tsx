'use client';

import React from 'react';

type CancelButtonProps = {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
};

export default function SoftActionButton({
    onClick,
    children = 'إلغاء',
    className = '',
    type = 'button',
}: CancelButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn-outline text-primary font-semibold hover:text-white rounded-full transition ${className}`}
        >
            {children}
        </button>
    );
}
