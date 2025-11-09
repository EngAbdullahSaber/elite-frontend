import InfoCell from "@/components/shared/InfoCell";
import { FilterConfig, SortConfig, TableColumn } from "@/types/components/Table";
import { MiniUser } from "@/types/dashboard/appointment";
import { formatDate } from "@/utils/date";
import { PaymentStatus, paymentStatusMap, paymentStatusStyle } from "@/constants/dashboard/payments";



export type PaymentRow = {
    id: number;
    appointmentId: number;
    client: MiniUser;
    amount: number;
    status: PaymentStatus;
    paidAt?: string | null;
    appointmentCompletedAt?: string | null;
};


export const paymentFilters: FilterConfig[] = [
    {
        type: 'select',
        label: 'الحالة',
        key: 'status',
        options: [
            { label: 'الكل', value: 'all' },
            { label: 'مدفوع', value: 'paid' },
            { label: 'غير مدفوع', value: 'unpaid' },
        ],
        default: 'all',
    },
    {
        type: 'dateRange',
        label: 'تاريخ الدفع',
        key: 'paidAt',
    },
    {
        type: 'dateRange',
        label: 'تاريخ إتمام الموعد',
        key: 'appointmentCompletedAt',
    },
];

export const paymentSortConfig: SortConfig = {
    sortFields: [
        { label: 'اسم العميل', value: 'clientName' },
        { label: 'المبلغ', value: 'amount' },
        { label: 'الحالة', value: 'status' },
        { label: 'تاريخ الدفع', value: 'paidAt' },
        { label: 'تاريخ إتمام الموعد', value: 'appointmentCompletedAt' },
    ],
    defaultSort: 'paidAt',
};

function formatSAR(amount: number): string {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(amount);
}

export const paymentColumns: TableColumn<PaymentRow>[] = [
    {
        key: 'client',
        label: 'العميل',
        cell: (user: MiniUser) => (
            <InfoCell image={user.image} subtitle={user.email} title={user.name} />
        ),
    },
    {
        key: 'amount',
        label: 'المبلغ',
        cell: (val: number) => <span className="font-medium">{formatSAR(val)}</span>,
    },
    {
        key: 'status',
        label: 'الحالة',
        cell: (val: PaymentStatus) => (
            <span className={`px-3 py-1 rounded-full text-sm ${paymentStatusStyle[val]}`}>{paymentStatusMap[val]}</span>
        ),
    },
    {
        key: 'paidAt',
        label: 'تاريخ الدفع',
        cell: (val?: string | null) => {
            if (!val) return <span className="text-xs text-gray-400">—</span>;
            const d = new Date(val);
            return <span className="font-medium">{formatDate(d)}</span>;
        },
    },
    {
        key: 'appointmentCompletedAt',
        label: 'تاريخ إتمام الموعد',
        cell: (val?: string | null) => {
            if (!val) return <span className="text-xs text-gray-400">—</span>;
            const d = new Date(val);
            return <span className="font-medium">{formatDate(d)}</span>;
        },
    },
];

export const mockPayments: PaymentRow[] = [
    {
        id: 501,
        appointmentId: 101,
        client: { id: 1, name: 'خالد الشمري', email: 'khaled@example.com', image: '/users/user-1.jpg' },
        amount: 450,
        status: 'paid',
        paidAt: '2025-09-28T12:00:00',
        appointmentCompletedAt: '2025-09-28T10:00:00',
    },
    {
        id: 502,
        appointmentId: 104,
        client: { id: 4, name: 'هناء العبدالله', email: 'hannah@example.com' },
        amount: 600,
        status: 'paid',
        paidAt: null,
        appointmentCompletedAt: '2025-09-29T15:00:00',
    },
    {
        id: 503,
        appointmentId: 108,
        client: { id: 8, name: 'ماجد السالم', email: 'majed@example.com', image: '/users/user-9.jpg' },
        amount: 750,
        status: 'unpaid',
        paidAt: '2025-09-30T09:30:00',
        appointmentCompletedAt: '2025-09-30T08:30:00',
    },
];


