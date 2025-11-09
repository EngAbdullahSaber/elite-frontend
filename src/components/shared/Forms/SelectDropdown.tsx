'use client';

import { useState, useRef } from "react";
import { SlArrowDown } from "react-icons/sl";
import { useOutsideClick } from "@/hooks/useOutsideClick";

type OptionItem = {
    label: string;
    value: string;
};

type SelectDropdownProps = {
    options: OptionItem[];
    value: string;
    onChange: (val: string, label: string) => void;
    label?: string;
};

export default function SelectDropdown({
    options,
    value,
    onChange,
    label,
}: SelectDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useOutsideClick(dropdownRef, () => setOpen(false));

    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? value;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="relative w-full py-3 px-8 focus:shadow-xl flex gap-2 items-center sm:text-sm bg-bg-1 border rounded-3xl justify-between"
            >
                <span className="truncate flex items-center gap-2">
                    {label && <span className="text-gray-500">{label}:</span>}
                    <span className="font-medium">{selectedLabel}</span>
                </span>
                <SlArrowDown size={13} className="text-gray-400" />
            </button>

            {open && (
                <ul
                    className="z-40 absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white text-base shadow-lg border focus:outline-none sm:text-sm"
                    role="listbox"
                >
                    {options.map((option, index) => (
                        <li
                            key={index}
                            role="option"
                            onClick={() => {
                                onChange(option.value, option.label);
                                setOpen(false);
                            }}
                            className="relative cursor-pointer select-none pl-4 py-2 pr-4 text-gray-700 hover:bg-gray-100"
                        >
                            <span className="truncate flex gap-3 items-center text-base font-normal">
                                {option.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
