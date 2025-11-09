
import Bookings from '@/components/main/customer/user-booking/Bookings';

export const metadata = {
    title: 'حجوزاتي',
    description: 'استعرض جميع حجوزاتك العقارية، وتابع حالتها أو قم بإدارتها بسهولة عبر منصة مراسل جدة العقاري.',
};

export default function UserBookingPage() {

    return (
        <div className="space-y-6">
            <Bookings />
        </div>
    );
}
