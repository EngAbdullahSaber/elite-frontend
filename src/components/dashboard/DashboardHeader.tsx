import HeaderActions from "../shared/Header/HeaderActions";
import MobileMenuButton from "../shared/MobileMenuButton";

interface HeaderProps {
    toggleSidebar: () => void;
}
export default function DashboardHeader({ toggleSidebar }: HeaderProps) {
    return (
        <header className="px-4 md:px-8 py-3 lg:py-6 flex gap-2 justify-between   w-full bg-white items-center">
            <HeaderActions />
            <h1 className="text-2xl font-semibold hidden lg:block">لوحة التحكم</h1>
            <MobileMenuButton onClick={toggleSidebar} />
        </header>
    )
}