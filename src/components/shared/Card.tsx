'use client'
import { useState, useRef, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

type CardProps = {
    children: React.ReactNode;
    title?: string;
    subTitle?: string;
    className?: string;
    hasMinHeight?: boolean;
    collapsible?: boolean; // 👈 new prop
};

export default function Card({
    children,
    title = "",
    subTitle = "",
    className = "",
    hasMinHeight = false,
    collapsible = false,
}: CardProps) {
    const [isOpen, setIsOpen] = useState(false); // default closed
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState("0px");

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
        }
    }, [isOpen, children]);

    return (
        <div
            className={`bg-white p-4 sm:p-6 rounded-2xl border ${hasMinHeight ? "min-h-[712px]" : ""
                } ${className}`}
        >
            {title && (
                <div className={`flex justify-between items-center mb-6`}>
                    <div>

                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {title}
                        </h3>
                        {subTitle && <p className="text-sm">{subTitle}</p>}
                    </div>

                    {collapsible && (
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-full  transition"
                        >
                            <FaChevronUp className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-0" : "rotate-180"}`} />
                        </button>
                    )}
                </div>
            )}

            {collapsible ? (
                <div
                    ref={contentRef}
                    style={{ height }}
                    className="transition-all duration-500 ease-in-out overflow-hidden"
                >
                    {children}
                </div>
            ) : (
                children
            )}
        </div>
    );
}
