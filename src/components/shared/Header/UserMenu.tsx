import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineHeart,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import MenuItem from "../MenuItem";
import FallbackImage from "../FallbackImage";

type Props = {
  user: { name: string; location: string; avatarUrl: string };
  onClose?: () => void;
  onLogout?: () => void;
};

export default function UserMenu({ user, onLogout, onClose }: Props) {
  function handleLogout() {
    onLogout?.();
    onClose?.();
  }
  return (
    <>
      <div className="flex gap-3 pb-3 items-center border-b border-dashed">
        <FallbackImage
          src={user.avatarUrl}
          alt=""
          width={55}
          height={55}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-gray-800 text-lg font-semibold">
            {user.name}
          </span>
          <span className="text-gray-600 text-sm">{user.location}</span>
        </div>
      </div>

      <div className="px-1 py-1" role="menu" aria-label="قائمة المستخدم">
        <MenuItem
          icon={<HiOutlineUser className="w-5 h-5" />}
          label="حسابي"
          href="/personal-info"
          onClick={onClose}
        />
        {/* <MenuItem
          icon={<HiOutlineCalendar className="w-5 h-5" />}
          label="حجوزاتي"
          href="/user-booking"
          onClick={onClose}
        /> */}
        <MenuItem
          icon={<HiOutlineHeart className="w-5 h-5" />}
          label="المفضلة"
          href="/favorites"
          onClick={onClose}
        />
      </div>
    </>
  );
}
