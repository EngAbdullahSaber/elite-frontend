import React, { useState, ReactNode } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
    children: ReactNode;
    text: string;
    className?: string;
    tipClassName?: string;
};

const Tooltip: React.FC<TooltipProps> = ({ children, text, className = "", tipClassName = "" }) => {
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onMouseMove={(e) => {
                setPosition({ x: e.clientX, y: e.clientY });
            }}
        >
            {children}
            {show && text &&
                createPortal(
                    <div
                        className={` ${tipClassName} fixed z-[99999] w-fit max-w-xs rounded-md 
                       bg-[var(--primary)]/90 text-white 
                       px-3 py-2 text-xs font-medium shadow-lg 
                       backdrop-blur-sm border border-[var(--primary-600)] 
                       pointer-events-none transition-opacity duration-150`}
                        style={{
                            top: position.y + 16,
                            left: position.x + 16,
                        }}
                    >
                        {text}
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default Tooltip;
