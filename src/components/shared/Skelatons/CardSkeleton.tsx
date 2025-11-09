import React from 'react';

type Props = {
    title?: string;
    height?: number | string;
    className?: string;
    children?: React.ReactNode;
};

export default function CardSkeleton({ title, height = 'auto', className = '', children }: Props) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-4 animate-pulse ${className}`} style={{ height }}>
            {title && (
                <div className="mb-4 h-6 w-1/3 bg-gray-200 rounded" />
            )}
            {children || (
                <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
            )}
        </div>
    );
}
