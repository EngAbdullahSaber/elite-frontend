'use client';

import React from 'react';
import Image from 'next/image';

export default function LogoIcon({ className = "" }) {
    return (

        <Image
            src="/raw-logo-blue.png"
            alt="Logo"
            className={className}
            width={35}
            height={100}
            priority
        />
    );
}


export function SideLogoIcon({ className = "" }) {
    return (

        <Image
            src="/logo-blue.png"
            alt="Logo"
            className={className}
            width={90}
            height={100}
            priority
        />
    );
}
