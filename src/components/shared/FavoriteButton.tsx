'use client';

import React from 'react';
import { Property } from '@/types/global';
import { useFavoriteProjects } from '@/contexts/FavoriteProjectsContext';

interface FavoriteButtonProps {
    property: Property;
}

export default function FavoriteButton({ property }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavoriteProjects();
    const active = isFavorite(property.id);

    return (
        <button
            onClick={() => toggleFavorite(property)}
            className={`z-10 p-2 rounded-full transition-colors ${active ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary-light'
                }`}
            aria-label="Toggle Favorite"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </button>
    );
}
