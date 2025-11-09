import React from 'react';

type StatCardProps = {
    displayValue?: string;
    label: string;
    subLabel?: string;
    ringColorClass?: string;
    className?: string;
};

export default function StatCard({
    displayValue,
    label,
    subLabel,
    ringColorClass = 'border-[var(--tertiary)]',
    className = '',
}: StatCardProps) {


    return (
        <div
            className={
                ` border flex flex-col justify-center items-center p-4 md:p-5 lg:p-6 rounded-2xl bg-white ` +
                className
            }
        >
            <div
                className={
                    `w-[170px] h-[170px] flex justify-center items-center
           rounded-full border-[14px] ` + ringColorClass
                }
            >
                <h2
                    className="
            text-xl md:text-2xl md:font-semibold
            2xl:text-4xl 2xl:font-semibold
            3xl:text-[40px]
          "
                >
                    {displayValue}
                </h2>
            </div>

            <span className="text-2xl font-semibold mt-4 text-nowrap">{label}</span>
            {subLabel && <span className="text-sm">{subLabel}</span>}
        </div>
    );
}
