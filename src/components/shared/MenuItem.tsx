'use client';

import React from 'react';
import Link from 'next/link';

type MenuItemProps = {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
};

export default function MenuItem({ icon, label, onClick, href }: MenuItemProps) {
    const commonClasses =
        'group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm hover:bg-gray-100 mt-2';

    if (href) {
        return (
            <Link href={href} className={commonClasses} role="menuitem" onClick={onClick}>
                {icon}
                {label}
            </Link>
        );
    }

    return (
        <button className={commonClasses} role="menuitem" onClick={onClick}>
            {icon}
            {label}
        </button>
    );
}
