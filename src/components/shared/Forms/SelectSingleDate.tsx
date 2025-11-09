'use client';

import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { SlArrowDown } from 'react-icons/sl';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { ar } from 'date-fns/locale';
import { Calendar, } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

type Props = {
    value?: Date;
    onChange: (date?: Date) => void;
    label?: string;
    className?: string;
    minDate?: Date;
    maxDate?: Date;
};

export default function SelectSingleDate({ value, onChange, label, className, minDate, maxDate }: Props) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick(dropdownRef, () => setOpen(false));

    const formatted = value ? format(value, 'yyyy-MM-dd') : 'لم يتم التحديد';


    return (
        <div className={`relative w-fit  ${className}`} ref={dropdownRef} dir="ltr">
            <button
                type="button"

                onClick={() => setOpen(!open)}
                className="open-btn relative w-full py-3 px-8 focus:shadow-xl flex gap-2 items-center sm:text-sm bg-bg-1 border rounded-3xl justify-end"
            >
                <span className="text truncate flex items-center gap-2" >
                    <span className="font-medium" >{formatted}</span>
                    {label && <span className="text-gray-500" >:{label}</span>}
                </span>
                <SlArrowDown size={13} className="text-gray-400" />
            </button>

            {open && (
                <div className="overflow-auto absolute z-50 mt-2 left-1/2 -translate-x-1/2  max-sm:w-full  max-w-[90vw] bg-white rounded-xl shadow-lg p-3
                flex flex-col items-center">
                    <div className="max-h-[24rem] overflow-auto">
                        <Calendar
                            date={value ?? new Date()}
                            onChange={(date) => {
                                onChange(date);
                                setOpen(false);
                            }}
                            minDate={minDate}
                            maxDate={maxDate}
                            locale={ar}
                            color='var(--primary-300)'

                        />
                    </div>
                    <button
                        onClick={() => {
                            onChange(undefined);
                            setOpen(false);
                        }}
                        className="mt-3 w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-md transition"
                    >
                        حذف التحديد
                    </button>
                </div>
            )}
        </div>
    );
}
