'use client';

import { SelectableItem } from '@/types/global';
import SelectableGroup from './SelectableGroup';
import { useState } from 'react';

type SelectableMenuProps = {
    items: SelectableItem[];
    onClose: () => void
};


export default function SelectableMenu({ items, onClose }: SelectableMenuProps) {
    const [openItem, setOpenItem] = useState<number | null>(null);
    function toggleOpen(index: number) {
        setOpenItem(p => p != index ? index : null)
    }
    return (
        <div className="flex-1 flex flex-col gap-2">
            {items.map((item, index) => (
                <SelectableGroup key={index} onToggleOpen={() => toggleOpen(index)} onClose={onClose} isOpen={openItem == index} item={item} />
            ))}
        </div>
    );
}
