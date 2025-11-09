import { ar } from 'date-fns/locale';
import { format, isSameDay } from "date-fns";
import { DateRange, RangeKeyDict } from "react-date-range";
import { useEffect, useState } from 'react';

type RangeCalenderProps = {
    value?: { startDate?: Date; endDate?: Date };
    onChange: (
        range: { startDate?: Date; endDate?: Date },
        formatted: string
    ) => void
    onClose?: () => void
};


export default function RangeCalender({ value, onChange, onClose }: RangeCalenderProps) {
    const [range, setRange] = useState([
        {
            startDate: value?.startDate,
            endDate: value?.endDate,
            key: 'selection',
        },
    ]);
    useEffect(() => {
        setRange([
            {
                startDate: value?.startDate,
                endDate: value?.endDate,
                key: 'selection',
            },
        ]);
    }, [value?.startDate, value?.endDate]);
    const isSelected = range[0].startDate && range[0].endDate;


    const formattedRange = isSelected
        ? `${format(range[0].startDate!, 'yyyy-MM-dd')} - ${format(range[0].endDate!, 'yyyy-MM-dd')}`
        : 'لم يتم التحديد';


    const handleReset = () => {
        setRange([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
        onChange({ startDate: undefined, endDate: undefined }, 'لم يتم التحديد')
        onClose?.();
    };

    function handleSelect(item: RangeKeyDict) {
        const { startDate, endDate, key } = item.selection;
        setRange([{ startDate, endDate, key: key ?? 'selection' }]);
        if (!startDate || !endDate) return;

        if (isSameDay(startDate, endDate)) return;
        onClose?.()
        onChange({ startDate: startDate ?? undefined, endDate: endDate ?? undefined }, formattedRange);
    }

    const fallbackRange = [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ];
    return (
        <div className="mt-2 p-3" dir="ltr">
            <DateRange
                editableDateInputs
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                rangeColors={['var(--primary-300)']}
                ranges={isSelected ? range : fallbackRange}
                locale={ar}
            />
            <button
                onClick={handleReset}
                className="mt-3 w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-md transition"
            >
                حذف التحديد
            </button>
        </div>
    )
}

