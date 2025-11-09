'use client';

import React from 'react';
import { TableColumn, TableRow } from '@/types/components/Table';
import Menu from '../Menu';
import { MenuActionItem } from '../Header/MenuActionList';
import NoRowsFound from '../NoRowsFound';
import MenuActionListWrapper from '../Header/MenuActionListWrapper';



interface TableProps<T = Record<string, any>> {
    columns: TableColumn<T>[];
    rows: TableRow<T>[];
    showActions?: boolean;
    actionsMenuItems?: (row: T, onClose?: () => void) => MenuActionItem[];
}

export default function Table<T = Record<string, any>>({
    columns,
    rows,
    actionsMenuItems,
    showActions = false,
}: TableProps<T>) {

    const allColumns: TableColumn<T>[] = showActions
        ? [...columns, { key: 'actions' as keyof T, label: '', className: 'w-12 text-center' }]
        : columns;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-fixed whitespace-nowrap  overflow-hidden">
                <thead>
                    <tr className="bg-[var(--primary-light)] text-right text-[var(--dark)]">
                        {allColumns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={`py-4 px-4 font-semibold text-sm uppercase tracking-wide border-b border-[var(--border)] ${col.className || ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={allColumns.length}>
                                <NoRowsFound />
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, idx) => (
                            <tr
                                key={idx}
                                className="border-b border-dashed hover:bg-[var(--bg-2)] transition-colors duration-200"
                            >
                                {allColumns.map((col) => {
                                    const value = row[col.key];

                                    return (
                                        <td
                                            key={String(col.key)}
                                            className={`py-4 px-4 text-right align-top text-[var(--dark)] ${col.className || ''}`}
                                        >
                                            {col.key === 'actions' && showActions ? (
                                                <Menu
                                                    width={200}
                                                    trigger={(toggle) => (
                                                        <button
                                                            onClick={toggle}
                                                            className="text-[var(--dark)] hover:text-[var(--primary)]"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                >
                                                    <MenuActionListWrapper row={row} actionsMenuItems={actionsMenuItems} />
                                                </Menu>
                                            ) : col.cell ? (
                                                col.cell(value, row)
                                            ) : value !== undefined ? (
                                                value as React.ReactNode
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
