import FallbackImage from '@/components/shared/FallbackImage';
import { FilterConfig, SortConfig, TableColumn } from '@/types/components/Table';
import { AgentRow, AgentStatus, agentStatusMap } from '@/types/dashboard/agent';
import { formatDate } from '@/utils/date';

export const agentStatusClassMap: Record<AgentStatus, string> = {
    active: 'bg-green-600 hover:bg-green-700',
    suspended: 'bg-red-600 hover:bg-red-700',
    pending: 'bg-yellow-500 hover:bg-yellow-600',
    rejected: 'bg-gray-500 hover:bg-gray-600',
};


export const agentSortConfig: SortConfig = {
    sortFields: [
        { label: 'الاسم', value: 'name' },
        { label: 'الحالة', value: 'status' },
        { label: 'تاريخ الانضمام', value: 'joinedAt' },
    ],
    defaultSort: 'name',
};


export const agentFilters: FilterConfig[] = [
    {
        type: 'select',
        label: 'الحالة',
        key: 'status',
        options: [
            { label: 'الكل', value: 'all' },
            { label: 'نشط', value: 'active' },
            { label: 'موقوف', value: 'suspended' },
            { label: 'قيد الانتظار', value: 'pending' },
            { label: 'مرفوض', value: 'rejected' },
        ],
        default: 'all',
    },
    {
        type: 'dateRange',
        label: 'تاريخ الانضمام',
        key: 'joinedAt',
    },
];


export const agentColumns: TableColumn<AgentRow>[] = [
    {
        key: 'image',
        label: 'الصورة',
        cell: (val) => {
            return (
                <FallbackImage src={val} alt="Agent" />
            );
        },
    },
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    {
        key: 'phone',
        label: 'رقم الهاتف',
        cell: (val) => (
            <span dir="ltr" className="block">{val}</span>
        ),
    },
    {
        key: 'joinedAt',
        label: 'تاريخ الانضمام',
        cell: (val) => <span>{formatDate(val)}</span>,
    },
    {
        key: 'status',
        label: 'الحالة',
        cell: (val) => {
            const statusStyles: Record<AgentStatus, string> = {
                active: 'bg-[#EBFBF2] text-[var(--secondary-500)]',
                suspended: 'bg-[#FFF0F0] text-[#BE6464]',
                pending: 'bg-yellow-100 text-yellow-700',
                rejected: 'bg-gray-200 text-gray-600',
            };
            const style = statusStyles[val as AgentStatus] || '';

            return (
                <span className={`${style} px-3 py-1 rounded-full text-sm`}>
                    {agentStatusMap[val as AgentStatus]}
                </span>
            );
        },
    },
];


export const mockedAgents: AgentRow[] = [
    {
        id: 1,
        image: '/users/user-21.jpg',
        name: 'راكان الزهراني',
        email: 'rakan.zahrani@agency.com',
        phone: '+966 544 888 777',
        joinedAt: '2024-02-10',
        status: 'active',
    },
    {
        id: 2,
        image: '/users/user-22.jpg',
        name: 'نورة السبيعي',
        email: 'noura.s@example.com',
        phone: '+966 512 345 678',
        joinedAt: '2023-07-21',
        status: 'pending',
    },
    {
        id: 3,
        image: '/users/user-23.jpg',
        name: 'فهد المطيري',
        email: 'fahad.mutairi@consultinghub.com',
        phone: '+966 533 876 543',
        joinedAt: '2022-11-30',
        status: 'suspended',
    },
    {
        id: 4,
        image: '/users/user-24.jpg',
        name: 'هند القحطاني',
        email: 'hind.qahtani@agency.com',
        phone: '+966 544 321 987',
        joinedAt: '2021-04-18',
        status: 'rejected',
    },
    {
        id: 5,
        image: '/users/user-25.jpg',
        name: 'ماجد الحربي',
        email: 'majid.harbi@realestatepro.com',
        phone: '+966 500 654 321',
        joinedAt: '2023-12-05',
        status: 'active',
    },
    {
        id: 6,
        image: '/users/user-26.jpg',
        name: 'سارة الزامل',
        email: 'sara.zamel@example.com',
        phone: '+966 511 789 456',
        joinedAt: '2022-05-14',
        status: 'suspended',
    },
    {
        id: 7,
        image: '/users/user-27.jpg',
        name: 'ليلى العتيبي',
        email: 'layla@example.com',
        phone: '+966 500 111 222',
        joinedAt: '2023-03-12',
        status: 'active',
    },
];