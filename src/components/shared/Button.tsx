'use client';

import React from 'react';
import Link from 'next/link';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: React.ReactNode;
    href?: string;
    external?: boolean; // Optional: for external links
}

export default function PrimaryButton({
    className = '',
    children,
    href,
    external = false,
    ...props
}: PrimaryButtonProps) {
    const baseClasses = `btn-primary hover:bg-primary-600 justify-center ${className}`;

    if (href) {
        return external ? (
            <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ) : (
            <Link href={href} className={baseClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button {...props} className={baseClasses}>
            {children}
        </button>
    );
}
