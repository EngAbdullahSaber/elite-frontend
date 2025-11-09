'use client';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { PaymentRow, mockPayments } from '@/constants/dashboard/agent/payments/constants';

export default function usePayments() {
    const searchParams = useSearchParams();
    const getParam = useCallback((key: string) => searchParams.get(key), [searchParams]);

    const getRows = useCallback(
        async (signal?: AbortSignal): Promise<{
            rows: PaymentRow[];
            error?: Error | null;
            totalCount?: number;
            totals?: { total_earnings: number; pending_balance: number; available_balance: number };
        }> => {
            try {
                const status = getParam('status');
                const paidFrom = getParam('paidAt_from');
                const paidTo = getParam('paidAt_to');
                const compFrom = getParam('appointmentCompletedAt_from');
                const compTo = getParam('appointmentCompletedAt_to');

                const sort = getParam('sort');
                const dir = getParam('dir');
                const page = parseInt(getParam('page') || '1', 10);
                const limit = parseInt(getParam('limit') || '10', 10);

                await new Promise((r) => setTimeout(r, 250));

                let filtered = [...mockPayments];

                if (status && status !== 'all') {
                    filtered = filtered.filter((row) => row.status === status);
                }

                if (paidFrom || paidTo) {
                    filtered = filtered.filter((row) => {
                        if (!row.paidAt) return false;
                        const d = new Date(row.paidAt);
                        d.setHours(0, 0, 0, 0);
                        const from = paidFrom ? new Date(paidFrom) : null;
                        if (from) from.setHours(0, 0, 0, 0);
                        const to = paidTo ? new Date(paidTo) : null;
                        if (to) to.setHours(0, 0, 0, 0);
                        return (!from || d >= from) && (!to || d <= to);
                    });
                }

                if (compFrom || compTo) {
                    filtered = filtered.filter((row) => {
                        if (!row.appointmentCompletedAt) return false;
                        const d = new Date(row.appointmentCompletedAt);
                        d.setHours(0, 0, 0, 0);
                        const from = compFrom ? new Date(compFrom) : null;
                        if (from) from.setHours(0, 0, 0, 0);
                        const to = compTo ? new Date(compTo) : null;
                        if (to) to.setHours(0, 0, 0, 0);
                        return (!from || d >= from) && (!to || d <= to);
                    });
                }

                if (sort) {
                    filtered.sort((a, b) => {
                        const direction = dir === 'desc' ? -1 : 1;
                        if (sort === 'clientName') {
                            return a.client.name.localeCompare(b.client.name) * direction;
                        }
                        if (sort === 'amount') {
                            return (a.amount - b.amount) * direction;
                        }
                        if (sort === 'status') {
                            return a.status.localeCompare(b.status) * direction;
                        }
                        if (sort === 'paidAt') {
                            const da = new Date(a.paidAt ?? 0).getTime();
                            const db = new Date(b.paidAt ?? 0).getTime();
                            return (da - db) * direction;
                        }
                        if (sort === 'appointmentCompletedAt') {
                            const da = new Date(a.appointmentCompletedAt ?? 0).getTime();
                            const db = new Date(b.appointmentCompletedAt ?? 0).getTime();
                            return (da - db) * direction;
                        }
                        return 0;
                    });
                }

                const total = filtered.length;
                const paginated = filtered.slice((page - 1) * limit, page * limit);

                const total_earnings = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
                const pending_balance = mockPayments.filter(p => p.status === 'unpaid').reduce((s, p) => s + p.amount, 0);
                const available_balance = total_earnings; // simplification for mock

                return { rows: paginated, totalCount: total, totals: { total_earnings, pending_balance, available_balance } };
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return { rows: [] };
                return { rows: [], error: new Error('فشل في جلب البيانات') };
            }
        },
        [getParam]
    );

    return getRows;
}


