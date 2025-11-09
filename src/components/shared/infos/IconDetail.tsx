import { ReactNode } from 'react';

type IconDetailProps = {
    icon: ReactNode;
    label: string;
    value: string | ReactNode;
    href?: string;
    className?: string;

};

export default function IconDetail({ icon, label, value, href, className }: IconDetailProps) {
    return (
        <div className="flex gap-3 items-center" >
            <div className={`rounded-full min-w-14 min-h-14 flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className="text-sm ">{label}</p>
                {href ? (
                    <a className={`text-lg font-medium ${className}`} href={href}>{value}</a>
                ) : (
                    <span className={`text-lg font-medium ${className}`}>{value}</span>
                )}
            </div>
        </div>
    );
}
