'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function SidebarLink({
    href,
    icon,
    children,
    badge,
}: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    badge?: string;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li>
            <Link
                href={href}
                className={`flex items-center justify-between gap-2 transition ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    }`}
            >
                <span className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium">{children}</span>
                </span>
                {badge && (
                    <span className="grid place-content-center w-6 h-6 rounded-full bg-secondary text-white text-sm">
                        {badge}
                    </span>
                )}
            </Link>
        </li>
    );
}
