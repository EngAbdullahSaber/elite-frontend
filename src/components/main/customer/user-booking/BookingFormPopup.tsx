import Popup from "@/components/shared/Popup";
import StarRating from "@/components/shared/StarRating";

export default function BookingFormPopup({ open, onClose, bookingId }: {
    open: boolean;
    onClose: () => void;
    bookingId: string;
}) {
    return (
        <Popup show={open} onClose={onClose} className="!w-[95%] xs:!w-sm ">
            <div className="">
                <h3 className="text-lg font-bold">إضافة مراجعة</h3>
                <form className="space-y-4">
                    <StarRating editable />
                    <textarea
                        className="w-full border rounded-md p-2"
                        placeholder="اكتب ملاحظاتك هنا..."
                    />
                    <div className="text-end">
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                            إرسال
                        </button>
                    </div>
                </form>
            </div>
        </Popup>
    );
}
