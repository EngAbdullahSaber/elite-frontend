'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BsArrowRight } from 'react-icons/bs';
import SelectInput from '@/components/shared/Forms/SelectInput';
import PrimaryButton from '@/components/shared/Button';

const propertyTypes = [
    { value: 'all', label: 'الكل' },
    { value: 'apartment', label: 'شقة' },
    { value: 'villa', label: 'فيلا' },
    { value: 'land', label: 'أرض' },
];

export default function ListPropertyFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const selectedType = searchParams.get('type') || 'all';

    const handleTypeChange = (newType: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', newType);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex justify-between flex-wrap items-center mb-6 gap-4 px-3">
            <PrimaryButton
                href="/projects"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-[#212391] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="عرض الكل"
            >
                <BsArrowRight className="mt-1" />
                <span className="hidden sm:inline">عرض الكل</span>
            </PrimaryButton>

            <SelectInput
                label=""
                small={true}
                className='w-32'
                name="propertyType"
                value={selectedType}
                onChange={handleTypeChange}
                options={propertyTypes}
            />
        </div>
    );
}
