import { FaTimes } from "react-icons/fa";

type SidebarTabsProps = {
    titles: string[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onRemove?: (index: number) => void;
    canRemove?: (index: number, total: number) => boolean;
    getKey?: (title: string, index: number) => string;
};

export default function SidebarTabs({
    titles,
    activeIndex,
    onSelect,
    onRemove,
    canRemove,
    getKey,
}: SidebarTabsProps) {
    const total = titles.length;

    return (
        <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-2">
            {titles.map((title, i) => {
                const active = i === activeIndex;
                const removable = !!onRemove && (canRemove ? canRemove(i, total) : total > 1);
                const itemKey = getKey ? getKey(title, i) : `${title}-${i}`;

                return (
                    <div
                        key={itemKey}
                        className={`flex items-center justify-between rounded-full transition text-ellipsis ${active ? "bg-primary text-white shadow-sm" : "text-neutral-800 hover:bg-white"}`}
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => onSelect(i)}
                            className={`flex-1 min-w-0 text-right focus:outline-none flex gap-2 items-center font-medium py-3 px-5 rounded-full`}
                            title={title}
                        >
                            <span className="truncate block">{title}</span>
                        </button>

                        {onRemove && (
                            <button
                                type="button"
                                aria-label="حذف"
                                className={`p-2 transition ${removable ? "text-gray-400 hover:text-red-500" : "text-gray-300 cursor-not-allowed"}`}
                                title="حذف"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!removable) return;
                                    onRemove(i);
                                }}
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}


