

export type TableColumn<T = Record<string, any>> = {
    key: keyof T;
    label: string;
    className?: string;
    cell?: (value: any, row?: T) => React.ReactNode;
};

export type TableRow<T = Record<string, any>> = T;

export type BaseFilterKeys = 'sort' | 'dir' | 'search' | 'page' | 'limit';

export type FilterConfig = {
    key: string;
    label: string;
    type: 'select' | 'dateRange' | 'custom';
    options?: { label: string; value: string }[];
    default?: string | { startDate?: Date; endDate?: Date };
    component?: React.FC<{
        value?: string;
        onChange: (val: string | undefined) => void;
    }>;
};



export type SortConfig = {
    defaultSort?: string;
    defaultDir?: string
    sortFields: { label: string; value: string }[];
    directions?: { label: string; value: string }[];
};
