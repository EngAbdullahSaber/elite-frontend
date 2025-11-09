'use client';

import { useFloatingMenuPosition } from '@/hooks/useFloatingMenuPosition';
import React, {
    cloneElement,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

export type MenuChildProps = {
    onClose: () => void;
};

type MenuProps = {
    trigger: (toggle: () => void) => ReactNode;
    children: ReactElement<MenuChildProps>; // expects onClose prop
    className?: string;
    triggerClassName?: string;
    width?: number; // px
    align?: 'right' | 'left'; // alignment relative to trigger
};

export default function Menu({
    trigger,
    children,
    width = 224,
    className = '',
    triggerClassName = '',
    align = 'right',
}: MenuProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const anchorRef = useRef<HTMLElement | null>(null); // the trigger wrapper

    const menuRef = useRef<HTMLDivElement | null>(null);
    const pos = useFloatingMenuPosition(anchorRef, isMenuOpen, width, align)


    const onClose = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen((p) => !p);

    // close when clicking outside anchor or menu (works across portal boundary)
    useEffect(() => {
        const handleMousedown = (ev: MouseEvent) => {
            if (!isMenuOpen) return;
            const target = ev.target as Node | null;
            if (!target) return;
            if (target instanceof Element && target.closest('[data-popup]')) {
                return;
            }
            if (menuRef.current?.contains(target)) return;
            if (anchorRef.current?.contains(target)) return;
            setIsMenuOpen(false);
        };
        document.addEventListener('mousedown', handleMousedown);
        return () => document.removeEventListener('mousedown', handleMousedown);
    }, [isMenuOpen]);

    // We'll render the trigger inside a span so we can measure it and attach ref
    // NOTE: trigger(toggle) might return a <button> — we wrap it in a span that forwards events.
    const triggerElement = (
        <span
            ref={(el) => {
                // anchorRef should be an HTMLElement. Cast from HTMLSpanElement to HTMLElement ok.
                anchorRef.current = el;
            }}
            className={`${triggerClassName} inline-flex`}
        // keep wrapper display inline so table layout unaffected
        >
            {trigger(toggleMenu)}
        </span>
    );

    // menu JSX (rendered into portal)
    const menuNode =
        pos && typeof document !== 'undefined' ? (
            createPortal(
                <div
                    ref={menuRef}
                    role="menu"
                    aria-hidden={!isMenuOpen}
                    style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        width: `${width}px`,
                        zIndex: 9999,
                    }}
                    className={`rounded-md bg-white shadow-lg border p-3 transition-all duration-150 ease-in-out transform ${isMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'} ${className}`}
                >
                    {cloneElement(children, { onClose })}
                </div>,
                document.body
            )
        ) : null;

    return (
        <>
            {/* trigger placed inline in DOM (inside table cell) so click area is correct */}
            {triggerElement}

            {/* only mount portal node when menu is open (or pos measured) */}
            {isMenuOpen && menuNode}
        </>
    );
}
