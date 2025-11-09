import React from 'react';
import { FaCheckSquare } from 'react-icons/fa';

const features = [
    { text: 'ابحث عن منزل أحلامك', color: 'text-primary' },
    { text: 'معاملات آمنة 100%', color: 'text-[var(--secondary-500)]' },
    { text: 'ضمان أفضل جودة', color: 'text-[var(--tertiary)]' },
    { text: 'تكاليف ضريبية منخفضة جدًا', color: 'text-primary' },
];

export default function FeatureList() {
    return (
        <ul className="columns-1 md:columns-2 flex-wrap mb-10">
            {features.map((feature, i) => (
                <li key={i} className="py-2">
                    <div className="flex items-center gap-2">
                        <FaCheckSquare className={`text-2xl ${feature.color}`} />
                        <p className="mb-0">{feature.text}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
