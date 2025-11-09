import { FaBars } from "react-icons/fa";

type MobileMenuButtonProps = {
    onClick: () => void;
};


export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
    return (
        <button className="lg:hidden border py-1 px-2 rounded-md bg-btn-bg" onClick={onClick}>
            <FaBars className="text-2xl" />
        </button>
    )
}