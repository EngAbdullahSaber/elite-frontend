'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

type SelectableButtonProps = {
    label: string;
    icon?: IconType;
    href?: string;
    active?: boolean;
    onClick?: () => void;
    children?: ReactNode;
    level?: number;
};

export default function SelectableButton({
    label,
    href,
    icon: Icon,
    onClick,
    children,
    active = false,
    level = 0,
}: SelectableButtonProps) {
    const paddingLeft = `${level * 16}px`;

    // Dynamic font size and weight based on level
    const style: React.CSSProperties = {
        fontSize: level === 0 ? '16px' : level === 1 ? '15px' : '14px',
        fontWeight: level === 0 ? 600 : level === 1 ? 500 : 400,
    }

    const className = `
        h-12 py-3 px-1 flex items-center w-full rounded-md transition-all
        hover:bg-[var(--primary-light)] hover:text-[var(--primary)]
        ${active ? "bg-[var(--primary-light)] text-[var(--primary)]" : "text-gray-700"}
    `;

    const content = (
        <div className="flex-1 flex items-center justify-start gap-3" style={{ paddingLeft }}>
            {Icon && <Icon size={20} className="" />}
            <span className="text-start">{label}</span>
        </div>
    );

    const ButtonElement = href ? (
        <Link href={href} onClick={onClick} className={`block ${className}`} style={style}>
            {content}
        </Link>
    ) : (
        <button onClick={onClick} className={className} style={style}>
            {content}
            {children && <ul className="mt-1 flex flex-col gap-1  border-gray-200 ">{children}</ul>}
        </button>
    );

    return <div>{ButtonElement}</div>;
}
