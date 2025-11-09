export type CityRow = {
    id: number;
    name: string;
    regionsCount: number;
};


// Types
export type Region = { id: number; name: string; selected?: boolean; };
export type City = { id: number; name: string; regions: Region[] };