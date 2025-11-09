"use client"
import { FaPlus, FaMinus } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

type FaqCardProps = {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
};

export default function FaqCard({ question, answer, isOpen, onClick }: FaqCardProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState("0px");

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
        }
    }, [isOpen]);

    return (
        <div
            className="bg-secondary-light rounded-xl md:rounded-2xl lg:rounded-[30px] p-3 sm:p-5 md:p-6 lg:px-10 cursor-pointer"
            onClick={onClick}
        >
            <button className="text-lg select-none md:text-xl w-full font-medium flex items-center text-right justify-between">
                <span>{question}</span>
                <span
                    className={`p-2 bg-secondary-500 duration-300 text-white rounded-full transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                >
                    {isOpen ? <FaMinus className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
                </span>
            </button>

            <div
                ref={contentRef}
                style={{ height }}
                className="transition-all duration-500 ease-in-out overflow-hidden"
            >
                <div className="border-t border-dash-long pt-4 mt-4">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
}
