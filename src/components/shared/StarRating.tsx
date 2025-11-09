'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
    value?: number;           // current rating (for display)
    editable?: boolean;       // whether user can change it
    onChange?: (rating: number) => void; // callback when rating changes
    max?: number;             // total stars
    className?: string
}

export default function StarRating({
    value = 0,
    editable = false,
    onChange,
    max = 5,
    className
}: StarRatingProps) {
    const [hover, setHover] = useState<number | null>(null);

    return (
        <div className={`flex gap-1 ${className}`}>
            {[...Array(max)].map((_, index) => {
                const ratingValue = index + 1;
                const isActive = ratingValue <= (hover ?? value);

                return (
                    <button
                        key={ratingValue}
                        type="button"
                        disabled={!editable}
                        onClick={() => editable && onChange?.(ratingValue)}
                        onMouseEnter={() => editable && setHover(ratingValue)}
                        onMouseLeave={() => editable && setHover(null)}
                        className="text-2xl focus:outline-none"
                    >
                        <FaStar size={20} className={isActive ? 'text-yellow-400' : 'text-gray-300'} />
                    </button>
                );
            })}
        </div>
    );
}
