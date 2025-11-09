import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import KeywordSearch from '@/components/shared/KeywordSearch';
import { projectTypeColors } from '@/constants/dashboard/admin/property.tsx/constants';
import { PropertyType, propertyTypeLabels } from '@/types/property';
import InfoCell from '@/components/shared/InfoCell';
import { getDefaultProjectpath } from '@/utils/appointment';

type Property = {
    id: string;
    imageLink: string;
    type: PropertyType;
    title: string;
};

type Props = {
    properties: Property[];
    onSelect: (property: Property) => void;
    label?: string;
};

export default function PropertyFilterContent({ properties, onSelect, label = 'العقار' }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query);

    const topProperties = properties.slice(0, 5);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const trimmed = debouncedQuery.trim();
        if (trimmed.length <= 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const lower = trimmed.toLowerCase();
            const filtered = properties.filter((p) =>
                p.title.toLowerCase().includes(lower)
            );
            setResults(filtered);
            setLoading(false);
        }, 300);
    }, [debouncedQuery, properties]);

    return (
        <>
            <h3 className="text-lg font-semibold mb-4">ابحث عن {label}</h3>
            <KeywordSearch
                inputRef={inputRef}
                value={query}
                onChange={setQuery}
                searchPlaceholder={`ابحث بعنوان ${label}`}
            />

            {loading ? (
                <p className="text-center text-sm text-gray-500">جاري البحث...</p>
            ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto mt-3">
                    {(results.length > 0 ? results : topProperties).map((property) => (
                        <button
                            key={property.id}
                            onClick={() => onSelect(property)}
                            type='button'
                            className="w-full text-left"
                        >
                            <div className="p-2">
                                <InfoCell
                                    title={property.title}
                                    image={property.imageLink}
                                    defaultImage={getDefaultProjectpath(property.type)}
                                    imageRounded="lg"
                                    subtitleClass={projectTypeColors[property.type]}
                                    subtitle={propertyTypeLabels[property.type]}
                                />
                            </div>
                        </button>
                    ))}
                    {results.length === 0 && debouncedQuery.trim().length > 2 && (
                        <p className="text-sm text-gray-400 text-center mt-2 min-h-32 flex justify-center items-center">
                            لا توجد نتائج
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
