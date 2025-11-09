'use client';
import { SlArrowDown } from "react-icons/sl";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Menu from "../Menu";
import RangeCalender from "./RangeCalender";
import { useState } from "react";
import { format } from "date-fns";


type DateRangePickerWrapperProps = {
    value?: { startDate?: Date; endDate?: Date };
    onChange: (range: { startDate?: Date; endDate?: Date }) => void;
    label?: string;
    className?: string;
    triggerClassName?: string;
    direction?: 'ltr' | 'rtl';
};

export default function SelectDateRange({
    value,
    onChange,
    label,
    className,
    triggerClassName,
    direction = 'ltr'
}: DateRangePickerWrapperProps) {
    const [formattedRange, setFormattedRange] = useState<string>(() => {
        const isSelected = value?.startDate && value?.endDate;
        const formattedRange = isSelected
            ? `${format(value.startDate!, 'yyyy-MM-dd')} - ${format(value.endDate!, 'yyyy-MM-dd')}`
            : 'لم يتم التحديد';

        return formattedRange;
    })

    function handleChange(
        range: { startDate?: Date; endDate?: Date },
        formatted: string
    ) {
        onChange(range)
        setFormattedRange(formatted)
    }

    return (

        <Menu
            align={direction === 'rtl' ? 'left' : 'right'}
            width={380}
            className={`${className} relative`}
            triggerClassName={triggerClassName}
            trigger={(toggle) => (
                <button
                    type="button"
                    onClick={toggle}
                    className="relative w-full py-3 px-8 focus:shadow-xl flex gap-2 items-center sm:text-sm bg-bg-1 border rounded-3xl justify-between"
                >
                    <span className="truncate flex items-center gap-2">
                        <span className="font-medium">{formattedRange}</span>
                        {label && <span className="text-gray-500">:{label}</span>}
                    </span>
                    <SlArrowDown size={13} className="text-gray-400" />
                </button>
            )}>

            <RangeCalender onChange={handleChange} value={value} />
        </Menu>
    )
}
