'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProjectImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ProjectImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full mx-auto">
            {/* Main Image */}
            <div className="w-full  lg:flex-[3]">
                <div className="relative w-full rounded-xl overflow-hidden border-2 border-[var(--primary-light)] shadow-md aspect-video lg:aspect-[4/3]">
                    <Image
                        src={mainImage}
                        alt="Main Project Image"
                        fill
                        className="object-cover object-center "
                    />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="w-full  lg:flex-[1]">
                <div className="flex flex-row flex-wrap lg:flex-col gap-4 justify-start">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`w-[100px] md:w-[200px] h-[100px] md:h-[200px] border rounded-lg overflow-hidden transition hover:opacity-80 ${img === mainImage ? 'border-[var(--primary)] shadow-md' : 'border-[var(--border)]'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
