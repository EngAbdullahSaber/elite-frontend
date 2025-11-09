import React from 'react';
import HelpCard from './HelpCard';

import { FiPhoneCall } from 'react-icons/fi';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { IoLocation } from 'react-icons/io5';


const helpData = [
    {
        title: 'اتصال مجاني',
        details: ['966\u00A054\u00A0364\u00A00639+'],
        iconBg: 'bg-primary text-white',
        icon: FiPhoneCall,
    },
    {
        title: 'الدعم عبر الإنترنت',
        details: ['ali@albarakati.net'],
        iconBg: 'bg-[var(--secondary)] text-[var(--neutral-700)]',
        icon: HiOutlineMailOpen,
    },
    {
        title: 'موقعنا',
        details: [
            'طريق الملك عبدالعزيز، جدة'],

        iconBg: 'bg-[var(--tertiary)] text-[var(--neutral-700)]',
        icon: IoLocation,
    },
];

export default function HelpSection() {
    return (
        <div className="py-[60px] lg:py-[120px] px-3 relative bg-white after:absolute after:bottom-0 after:right-0 after:w-full after:isolate after:h-[34%] after:bg-[var(--bg-2)]">
            <div className="text-center">
                <h2 className="h2 mt-4 mb-6">هل تحتاج إلى مساعدة؟</h2>
                <p className="mb-0">الاستفسارات، الشكاوى والملاحظات. يسعدنا خدمتك</p>
            </div>
            <div className="container pt-[30px] lg:pt-[60px] relative z-[1]">
                <div className="grid grid-cols-12 gap-4">
                    {helpData.map((card, index) => (
                        <div key={index} className="col-span-12 md:col-span-6 xl:col-span-4">
                            <HelpCard details={card.details} icon={card.icon} title={card.title} iconBg={card.iconBg} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
