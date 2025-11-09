import { FilterConfig } from "@/types/components/Table";
import { Role } from "@/types/global";
import { PropertyType } from "@/types/property";


export const getDefaultProjectpath = (type?: PropertyType) => {
    switch (type) {
        case 'apartment':
            return '/main/projects/defaults/default-project-house.svg';
        case 'villa':
            return '/main/projects/defaults/default-project-Villa.svg';
        case 'office':
            return '/main/projects/defaults/default-project-Land.svg';
        default:
            return '/main/projects/defaults/default-project-house.svg';
    }
};
export function getRoleBasedAppointmentFilters(role: Role, baseFilters: FilterConfig[]): FilterConfig[] {
    return baseFilters.map((filter) => {
        if (filter.key === 'status' && role === 'agent') {
            return {
                ...filter,
                options: filter.options?.filter(
                    (opt) => !['pending', 'assigned', 'confirmed'].includes(opt.value)
                ),
            };
        }

        if (filter.key === 'agentId' && role !== 'admin') {
            return null; // remove agentId for non-admins
        }

        return filter;
    }).filter((f): f is FilterConfig => f !== null);
}
