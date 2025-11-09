'use client';

import React, { useEffect, useRef, useState } from 'react';
import InfoCell from '../shared/InfoCell';
import KeywordSearch from '../shared/KeywordSearch';
import { useDebounce } from '@/hooks/useDebounce';

type User = {
    id: number;
    name: string;
    email: string;
    image?: string;
    createdAt?: Date; // optional for time filtering
};

type Props = {
    users: User[];
    onSelect: (user: User) => void;
    label?: string;
    filterByTime?: boolean;
};

export default function UserFilterContent({ users, onSelect, label = 'المستخدم', filterByTime = false }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedQuery = useDebounce(query);

    const topUsers: User[] = React.useMemo(() => {
        return users?.slice(0, 5);
    }, [users]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const fetchFilteredUsers = async () => {
            const trimmed = debouncedQuery.trim();
            if (trimmed.length <= 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            await new Promise((r) => setTimeout(r, 300));

            const lower = trimmed.toLowerCase();
            let filtered = users?.filter(
                (u) =>
                    u.name.toLowerCase().includes(lower) ||
                    u.email.toLowerCase().includes(lower)
            );

            if (filterByTime) {
                const now = new Date();
                filtered = filtered.filter((u) => {
                    if (!u.createdAt) return true;
                    const diff = (now.getTime() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60);
                    return diff <= 48; // e.g. created within last 48 hours
                });
            }

            setResults(filtered);
            setLoading(false);
        };

        fetchFilteredUsers();
    }, [debouncedQuery, users, filterByTime]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">ابحث عن {label}</h3>
            <KeywordSearch
                inputRef={inputRef}
                value={query}
                onChange={setQuery}
                searchPlaceholder={`ابحث باسم أو بريد ${label}`}
            />

            {loading ? (
                <p className="text-center text-sm text-gray-500">جاري البحث...</p>
            ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto mt-3">
                    {results.length > 0 ? (
                        results.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => onSelect(user)}
                                type='button'
                                className="w-full text-left"
                            >
                                <InfoCell
                                    image={user.image}
                                    subtitle={user.email}
                                    title={user.name}
                                    href={`/dashboard/admin/${label === 'العميل' ? 'clients' : 'agents'}/${user.id}`}
                                    imageRounded="full"
                                    className="hover:bg-gray-100 p-2 rounded"
                                />
                            </button>
                        ))
                    ) : debouncedQuery.trim().length <= 2 ? (
                        <>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">الأكثر تفاعلاً</h4>
                            {topUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => onSelect(user)}
                                    className="w-full text-left"
                                >
                                    <InfoCell
                                        image={user.image}
                                        subtitle={user.email}
                                        title={user.name}
                                        imageRounded="full"
                                        className="hover:bg-gray-100 p-2 rounded"
                                    />
                                </button>
                            ))}
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 text-center mt-2 min-h-32 flex justify-center items-center">
                            لا توجد نتائج
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
