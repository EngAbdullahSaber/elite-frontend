import React from 'react';

type Props = {
    width?: string | number;
    height?: number;
    className?: string;
};

export default function TextSkeleton({ width = '100%', height = 16, className = '' }: Props) {
    return (
        <div
            className={`bg-gray-200 rounded animate-pulse ${className}`}
            style={{ width, height }}
        />
    );
}
