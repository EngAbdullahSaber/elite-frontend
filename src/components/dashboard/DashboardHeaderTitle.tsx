import { ReactElement } from "react";
import { SlArrowLeft } from "react-icons/sl";

type DashboardHeaderTitleProps = {
    path: string[];
    children?: ReactElement;
};

export default function DashboardHeaderTitle({ path, children }: DashboardHeaderTitleProps) {
    return (
        <div className="flex items-center justify-between flex-wrap px-4 py-4 md:px-10 md:py-8 lg:px-16 lg:py-10 bg-[var(--bg-1)] gap-4">
            <div className="flex gap-2 items-center text-[var(--dark)]">
                <div className="w-6 h-6 text-[var(--primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-full">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="4" />
                    </svg>
                </div>
                {path.map((title, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold">{title}</h4>
                        {index < path.length - 1 && (
                            <SlArrowLeft size={12} className="text-[var(--primary-300)]" />
                        )}
                    </div>
                ))}
            </div>
            {children}
        </div>
    );
}
