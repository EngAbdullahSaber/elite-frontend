import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cleanHref } from '@/utils/helpers';
import { SelectableItem } from '@/types/global';

export function useSelectableGroup(
    item: SelectableItem,
    isOpen: boolean,
) {
    const [openItem, setOpenItem] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);
    const pathname = usePathname();

    const hasChildren = Array.isArray(item?.children) && item?.children.length > 0;

    useEffect(() => {
        if (!item?.href) return;
        const cleanedParentHref = cleanHref(item.href);
        const active = cleanedParentHref === pathname;
        setIsActive(active);
    }, [item?.href, pathname]);

    useEffect(() => {
        if (!isOpen) setOpenItem(null);
    }, [isOpen]);

    function toggleOpen(index: number) {
        setOpenItem(prev => (prev !== index ? index : null));
    }

    return {
        openItem,
        setOpenItem,
        isActive,
        hasChildren,
        toggleOpen,
    };
}
