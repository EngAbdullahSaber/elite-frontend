'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/global';
import FavoriteButton from '@/components/shared/FavoriteButton';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { propertyTypeLabels } from '@/types/property';
export default function PropertyCardList({ property, isAdmin = false }: { property: Property; isAdmin?: boolean }) {
    const { imageLink, type, title, link, rooms, beds, area, location, price } = property;

    return (
        <div className="bg-white grid grid-cols-12 rounded-xl shadow-lg overflow-hidden border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 p-2">
            {/* Image Section */}
            <div className="col-span-12 xs:col-span-5 relative group overflow-hidden h-[200px] sm:h-[220px] rounded-xl">
                <Image
                    src={imageLink}
                    alt={title}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0" />
                <Link
                    href={`/projects?type=${type}`}
                    aria-label={`عرض مشاريع من نوع ${propertyTypeLabels[type]}`}
                    className="absolute top-3 left-3 z-10 bg-white text-primary rounded-full py-1.5 px-3 text-xs font-semibold shadow hover:bg-primary-light transition"
                >
                    {propertyTypeLabels[type]}
                </Link>
                <div className="absolute w-[100px] top-3 right-3 flex items-center gap-2 z-10">
                    <FavoriteButton property={property} />

                    {isAdmin && (
                        <Link
                            href={`/dashboard/admin/projects/edit/${property.id}`}
                            className="bg-white p-2 rounded-full shadow hover:bg-gray-300 transition"
                        >
                            <BiEdit className="w-5 h-5 text-gray-600" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="col-span-12 xs:col-span-7 flex flex-col justify-between px-4 py-3 gap-2">
                {location && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>{location}</span>
                    </div>
                )}

                <Link
                    href={link}
                    className="text-lg sm:text-xl font-bold text-neutral-800 hover:text-primary transition truncate"
                    title={title}
                >
                    {title}
                </Link>

                <ul className="flex justify-between text-sm text-neutral-600 mt-2">
                    {rooms && (
                        <li className="flex items-center gap-2">
                            <i className="las la-city text-lg text-primary" />
                            <span>{rooms}</span>
                        </li>
                    )}
                    {beds && (
                        <li className="flex items-center gap-2">
                            <i className="las la-bed text-lg text-primary" />
                            <span>{beds}</span>
                        </li>
                    )}
                    {area && (
                        <li className="flex items-center gap-2">
                            <i className="las la-arrows-alt text-lg text-primary" />
                            <span>{area}</span>
                        </li>
                    )}
                </ul>

                <div className="border-t border-dashed my-3" />

                {/* Footer Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-primary">
                        {price?.toLocaleString() || '1,704,550,555'} ريال
                    </p>

                    <Link
                        href={link}
                        className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-primary border border-primary px-2 py-2 rounded-full hover:bg-primary hover:text-white transition duration-200"
                        aria-label={`اقرأ المزيد عن ${title}`}
                    >
                        <span>اقرأ المزيد</span>
                        <i className="las la-arrow-left text-base" />
                    </Link>


                </div>
            </div>
        </div>
    );
}
