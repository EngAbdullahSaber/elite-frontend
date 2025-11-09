import { FaBars } from "react-icons/fa";
import Navbar from "./Navbar";
import MobileMenuButton from "../MobileMenuButton";


type DesktopNavbarProps = {
    onOpenMobileMenu: () => void;
};

export default function DesktopNavbar({ onOpenMobileMenu }: DesktopNavbarProps) {
    return (
        <div className="lg:order-1">
            {/* Mobile Menu Button */}
            <MobileMenuButton onClick={onOpenMobileMenu} />

            <div className="lg:block hidden">
                <Navbar />
            </div>
        </div>
    );
}
