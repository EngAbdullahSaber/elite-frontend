import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import LogoIcon, { SideLogoIcon } from "../shared/LogoIcon";
import Link from "next/link";
import SelectableMenu from "../shared/NavigationTree/SelectableMenu";
import LogoutButton from "../shared/LogoutButton";
import { dashboardItems } from "@/constants/dashboardItems";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { SelectableItem } from "@/types/global";


interface SidebarProps {
    sidebarOpen: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({ sidebarOpen, onClose }: SidebarProps) {

    const sidebarRef = useRef<HTMLDivElement>(null);
    const role = useRoleFromPath();
    let items: SelectableItem[] = [];

    if (role) {
        items = dashboardItems[role];
    }


    useOutsideClick(sidebarRef, onClose);

    return (
        <div
            ref={sidebarRef}
            className={`${sidebarOpen ? 'mr-0' : 'mr-[-312px]'} lg:mr-0 w-[270px] sm:w-[312px] transition-all duration-300 ease-out z-20 overflow-x-hidden overflow-y-auto fixed top-0 bottom-0 bg-white flex flex-col border-r p-3 md:p-8 min-h-screen shadow-lg lg:shadow-none scrollbarthin`}
        >
            <div className="mb-6 flex flex-col items-center">
                <div className="inline-flex items-center pb-[24px] border-b border-dashed cursor-pointer w-full ">
                    <Link href="/" className="block mx-auto">
                        <SideLogoIcon />
                    </Link>
                </div>
            </div>
            <SelectableMenu items={items} onClose={onClose} />
            <LogoutButton />
        </div >
    );
}
