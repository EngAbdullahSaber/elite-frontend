'use client';

import { FiChevronDown } from 'react-icons/fi';
import SelectableButton from './SelectableButton';
import { SelectableItem } from '@/types/global';
import { useSelectableGroup } from '@/hooks/useSelectableGroup';

type SelectableGroupProps = {
    item: SelectableItem;
    isOpen: boolean;
    onToggleOpen: () => void;
    onClose: () => void;
    level?: number;
};

export default function SelectableGroup({
    item,
    isOpen = false,
    onToggleOpen,
    onClose,
    level = 0,
}: SelectableGroupProps) {
    const {
        openItem,
        isActive,
        hasChildren,
        toggleOpen,
    } = useSelectableGroup(item, isOpen);

    return (
        <div>
            <SelectableButton
                label={item.label}
                icon={item.icon}
                href={item?.href}
                active={isActive}
                onClick={() => {
                    onToggleOpen();
                    if (item?.href) onClose();
                }}
                level={level}
            >
                {hasChildren && (
                    <span
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                        <FiChevronDown size={18} />
                    </span>
                )}
            </SelectableButton>

            {hasChildren && (
                <ul
                    className={`mt-1 flex flex-col gap-1 overflow-hidden transition-all duration-300 border-r pr-4 border-gray-300 ${isOpen ? '' : 'max-h-0'
                        }`}
                >
                    {item?.children?.map((child, index) => (
                        <li key={index}>
                            <SelectableGroup
                                item={child}
                                isOpen={openItem === index}
                                onClose={onClose}
                                onToggleOpen={() => toggleOpen(index)}
                                level={level + 1}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
