import Notifications from "../Notifications";

type Notification = {
  id: number;
  name: string;
  message: string;
  time: string;
  avatarUrl: string;
};

export default function NotificationsMenu() {
  return (
    <div
      className="px-1 py-1 max-h-[300px] overflow-y-auto"
      role="menu"
      aria-label="قائمة الإشعارات"
    >
      <h5 className="text-xl font-semibold text-neutral-700 mb-2 text-right">
        الإشعارات
      </h5>
      <Notifications />
    </div>
  );
}
