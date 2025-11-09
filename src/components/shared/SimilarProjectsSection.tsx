'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import SwiperNextButton from '@/components/shared/SwiperNextButton';
import SwiperPrevButton from '@/components/shared/SwiperPrevButton';

import { Property } from '@/types/global';
import PropertyCardGrid from '../main/projects/PropertyCardGrid';

interface SimilarProjectsSectionProps {
    projects: Property[];
    title: string
}

export default function SimilarProjectsSection({ projects, title }: SimilarProjectsSectionProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="relative mt-12  mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>

            <div className="relative ">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    navigation={{
                        nextEl: '.property-next',
                        prevEl: '.property-prev',
                    }}
                    loop={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                        1536: { slidesPerView: 5 },
                    }}
                    className="swiper max-w-full text-center  md:items-stretch"
                >

                    {projects.map((property, idx) => (
                        <SwiperSlide key={idx} className="!h-full p-2  items-stretch">
                            <div className="!h-full flex items-stretch">
                                <PropertyCardGrid property={property} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <SwiperPrevButton className="property-prev absolute top-[40%] left-2 xl:left-1 z-10" />
                <SwiperNextButton className="property-next absolute top-[40%] right-2 xl:right-1 z-10" />
            </div>
        </section>
    );
}
