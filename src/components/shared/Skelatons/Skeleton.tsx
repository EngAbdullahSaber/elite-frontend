'use client';

import React from 'react';

type SkeletonProps = {
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export default function Skeleton({ className = 'h-4 w-full', rounded = 'md' }: SkeletonProps) {
    const roundedClass = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    }[rounded];

    return (
        <div
            className={`
                'animate-pulse bg-gray-200 dark:bg-gray-700',
                ${roundedClass}
                ${className}
            `}
        />
    );
}
