'use client';

import React from 'react';
import { generatePagination } from '@/utils/helpers';
import {
    MdFirstPage,
    MdLastPage,
    MdChevronLeft,
    MdChevronRight,
} from 'react-icons/md';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
    if (pageCount <= 1) return null;

    return (
        <div className="flex flex-wrap justify-center items-center pt-6 pb-6 gap-2">
            {/* First Page */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`border flex items-center justify-center text-[var(--neutral-700)] px-3 py-2 w-[40px] h-[40px] rounded-full duration-300 hover:scale-[1.1] ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--btn-bg)]'
                    }`}
            >
                <MdLastPage size={20} />
            </button>

            {/* Previous Page */}
            <button
                onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`border flex items-center justify-center text-[var(--neutral-700)] px-3 py-2 w-[40px] h-[40px] rounded-full duration-300 hover:scale-[1.1] ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--btn-bg)]'
                    }`}
            >
                <MdChevronRight size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex flex-wrap justify-center gap-2">
                {generatePagination(currentPage, pageCount).map((item, idx) =>
                    item === '...' ? (
                        <span key={idx} className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => onPageChange(Number(item))}
                            className={`px-3 py-2 w-[40px] h-[40px] rounded-full duration-300 hover:scale-[1.1] ${currentPage === item
                                ? 'bg-[var(--primary)] text-white font-semibold'
                                : 'bg-white border text-[var(--neutral-700)] hover:bg-[var(--btn-bg)]'
                                }`}
                        >
                            {item}
                        </button>
                    )
                )}
            </div>

            {/* Next Page */}
            <button
                onClick={() => onPageChange(currentPage < pageCount ? currentPage + 1 : pageCount)}
                disabled={currentPage === pageCount}
                className={`border flex items-center justify-center text-[var(--neutral-700)] px-3 py-2 w-[40px] h-[40px] rounded-full duration-300 hover:scale-[1.1] ${currentPage === pageCount ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--btn-bg)]'
                    }`}
            >
                <MdChevronLeft size={20} />
            </button>

            {/* Last Page */}
            <button
                onClick={() => onPageChange(pageCount)}
                disabled={currentPage === pageCount}
                className={`border flex items-center justify-center text-[var(--neutral-700)] px-3 py-2 w-[40px] h-[40px] rounded-full duration-300 hover:scale-[1.1] ${currentPage === pageCount ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--btn-bg)]'
                    }`}
            >
                <MdFirstPage size={20} />
            </button>
        </div>
    );
}
