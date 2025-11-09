import Card from "@/components/shared/Card";
import Notifications from "@/components/shared/Notifications";

export const metadata = {
    title: 'الإشعارات',
    description: 'تابع أحدث التنبيهات والإشعارات الخاصة بحسابك العقاري عبر منصة مراسل جدة العقاري.',
};


export default function UserNotificationPage() {


    return (
        <Card title="الإشعارات" hasMinHeight={true}>
            <Notifications />
        </Card>
    );
}
