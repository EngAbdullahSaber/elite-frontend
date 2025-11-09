import React from 'react';

interface Props {
    step: number;
    title: string;
    description: string;
    imageSrc: string;
}

export default function WorkProcessCard({ step, title, description, imageSrc }: Props) {
    return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[var(--bg-1)] p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center ">
            <div className="relative mb-6 w-[120px] h-[120px]">
                <img
                    src={imageSrc}
                    alt="العملية"
                    className="w-full h-full object-contain rounded-lg"
                />
                <span className="bg-primary text-white w-9 h-9 rounded-full absolute -top-3 -left-3 text-lg font-bold flex items-center justify-center shadow-md">
                    {step}
                </span>
            </div>
            <h4 className="text-xl lg:text-2xl font-bold text-[var(--primary-dark)] mb-2 tracking-tight">
                {title}
            </h4>
            <p className="text-[var(--neutral-600)] text-sm leading-relaxed max-w-[280px]">
                {description}
            </p>
        </div>
    );
}
