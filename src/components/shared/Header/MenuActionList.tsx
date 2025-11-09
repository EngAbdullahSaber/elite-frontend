'use client';

import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import { MenuChildProps } from '../Menu';
import Popup from '../Popup';


export type ActionType = 'primary' | 'delete' | 'normal';

export type MenuActionItem = {
    label: string;
    icon?: ReactElement;
    type?: ActionType;
    link?: string;
    child?: ReactElement<MenuChildProps>;
};

type Props = {
    items?: MenuActionItem[];
    onClose?: () => void;
};

export default function MenuActionList({ items, onClose }: Props) {
    const [activeChild, setActiveChild] = useState<ReactElement<MenuChildProps> | undefined>(undefined);
    const [menuOpen, setMenuOpen] = useState(false);

    const getColorClass = (type?: ActionType) => {
        let className = '';
        if (type === 'primary') {
            className = 'text-[var(--primary)] hover:text-[var(--primary-300)]';
        } else if (type === 'delete') {
            className = 'text-red-600 hover:text-red-800';
        } else {
            className = 'text-[var(--dark)] hover:text-[var(--primary)]';
        }

        return className;
    };


    function handleOnClose() {
        setMenuOpen(false);
    }
    if (items?.length == 0) return null;
    return (
        <div className="flex flex-col gap-2">
            {items?.map((item, index) => {
                const content = (
                    <>
                        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                        <span>{item.label}</span>
                    </>
                );

                if (item.link) {
                    return (
                        <Link
                            key={index}
                            href={item.link}
                            onClick={onClose}
                            className={`flex items-center gap-2 text-sm ${getColorClass(item.type)} disabled:opacity-50`}
                        >
                            {content}
                        </Link>
                    );
                }

                return (
                    <button
                        key={index}
                        onClick={() => {
                            setActiveChild(item.child);
                            setMenuOpen(true);
                        }}
                        className={`flex items-center gap-2 text-sm ${getColorClass(item.type)}`}
                    >
                        {content}
                    </button>
                );
            })}

            {/* Render child if active */}
            {activeChild && (
                <Popup onClose={handleOnClose} show={menuOpen}>
                    {React.cloneElement(activeChild as React.ReactElement<any>, {
                        onCancel: handleOnClose,
                    })}
                </Popup>
            )}


        </div>
    );
}
