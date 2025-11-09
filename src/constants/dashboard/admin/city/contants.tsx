import { SortConfig, TableColumn } from "@/types/components/Table";
import { City, CityRow } from "@/types/dashboard/city";


export const citySortConfig: SortConfig = {
    defaultSort: 'name',          // default column to sort by
    defaultDir: 'asc',            // default direction
    sortFields: [
        { label: 'المدينة', value: 'name' },
        { label: 'عدد المناطق', value: 'regionsCount' },
    ]
};


export const cityColumns: TableColumn<CityRow>[] = [
    { key: 'name', label: 'المدينة' },
    { key: 'regionsCount', label: 'عدد المناطق' },
];



// Mocked cities for edit mode (matching your CityRow list)
export const mockedCitiesForEdit: City[] = [
    {
        id: 1,
        name: 'المدينة المنورة',
        regions: [
            { id: 101, name: 'العوالي', selected: true },
            { id: 102, name: 'قباء', selected: false },
            { id: 103, name: 'المدينة الجنوبية', selected: true },
            { id: 104, name: 'المدينة الشمالية', selected: false },
            { id: 105, name: 'المركزية', selected: false },
        ],
    },
    {
        id: 2,
        name: 'الطائف',
        regions: [
            { id: 201, name: 'الهدا', selected: false },
            { id: 202, name: 'السيل الصغير', selected: true },
            { id: 203, name: 'القيم', selected: false },
        ],
    },
    {
        id: 3,
        name: 'أبها',
        regions: [
            { id: 301, name: 'المعتق', selected: false },
            { id: 302, name: 'الخالدية', selected: false },
            { id: 303, name: 'النصار', selected: true },
        ],
    },
    {
        id: 4,
        name: 'تبوك',
        regions: [
            { id: 401, name: 'المنطقة الأولى', selected: true },
            { id: 402, name: 'المنطقة الثانية', selected: true },
            { id: 403, name: 'المنطقة الثالثة', selected: false },
            { id: 404, name: 'المنطقة الرابعة', selected: false },
            { id: 405, name: 'المنطقة الخامسة', selected: false },
        ],
    },
    {
        id: 5,
        name: 'حائل',
        regions: [
            { id: 501, name: 'المنطقة الأولى', selected: true },
            { id: 502, name: 'المنطقة الثانية', selected: false },
            { id: 503, name: 'المنطقة الثالثة', selected: false },
        ],
    },
];


// Mocked unsaved Data
export const mockedUnSavedCities: City[] = [
    {
        id: 1,
        name: 'الرياض',
        regions: [
            { id: 1, name: 'العليا' },
            { id: 2, name: 'الملز' },
            { id: 3, name: 'النخيل' },
            { id: 4, name: 'الصحافة' },
        ],
    },
    {
        id: 2,
        name: 'جدة',
        regions: [
            { id: 5, name: 'الروضة' },
            { id: 6, name: 'الحمراء' },
            { id: 7, name: 'السلامة' },
        ],
    },
    {
        id: 3,
        name: 'مكة',
        regions: [
            { id: 8, name: 'العزيزية' },
            { id: 9, name: 'الشوقية' },
            { id: 10, name: 'الشرائع' },
        ],
    },
];
