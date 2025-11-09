'use client';

import { extractVideoId } from '@/utils/helpers';
import React, { useMemo, useState } from 'react';

interface VideoSectionProps {
    videoUrl: string;
    title?: string;
}

export default function VideoSection({ videoUrl, title = 'Inside Our Properties' }: VideoSectionProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoId = useMemo(() => extractVideoId(videoUrl), [videoUrl]);

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    const handlePlay = () => {
        setIsPlaying(true);
    };

    // ✅ If no valid videoId, show fallback message
    if (!videoId) {
        return (
            <section className="relative mx-auto max-w-6xl mt-10 z-30">
                <div
                    className="relative w-full rounded-2xl overflow-hidden border shadow-lg bg-gray-50"
                    style={{ paddingTop: '56.25%' }}
                >
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <p className="text-gray-600 font-medium text-center">
                            ⚠️ الرابط المدخل غير صالح أو لا يمثل فيديو يوتيوب
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative mx-auto max-w-6xl mt-10 z-30">
            <div
                className="relative w-full rounded-2xl overflow-hidden border shadow-lg"
                style={{ paddingTop: '56.25%' }}
            >
                {!isPlaying ? (
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center cursor-pointer flex items-center justify-center"
                        style={{ backgroundImage: `url(${thumbnailUrl})` }}
                        onClick={handlePlay}
                    >
                        <span className="bg-[var(--tertiary)] w-16 h-16 grid place-items-center rounded-full shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="black"
                                viewBox="0 0 24 24"
                                className="w-6 h-6"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </span>
                    </div>
                ) : (
                    <iframe
                        className="absolute top-0 left-0 w-full h-full bg-gray-200"
                        src={embedUrl}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>
        </section>
    );
}
