import React from 'react';

type Props = {
    size?: number;
};

export default function AvatarSkeleton({ size = 80 }: Props) {
    return (
        <div
            className="bg-gray-200 rounded-full animate-pulse"
            style={{ width: size, height: size }}
        />
    );
}
