import { ReactNode } from 'react';

type CardInfoProps = {
    icon: ReactNode;
    value: string | number;
    title?: string;
    label?: string;
    className?: string; // ✅ new prop

};

export default function CardInfo({ icon, value, label, title, className }: CardInfoProps) {
    return (
        <div className={`bg-white border min-w-[250px]  rounded-2xl p-3 xl:p-3 ${className || ''}`}>
            {title && <p className='text-base mb-2'>{title}</p>}
            <div className='flex items-center gap-6  '>

                <div className={`flex items-center justify-center rounded-full `}>
                    {icon}
                </div>
                <div>
                    <h3 className="h3 font-semibold mb-1">{value}</h3>
                    <span className="text-sm text-gray-600">{label}</span>
                </div>
            </div>
        </div>
    );
}
