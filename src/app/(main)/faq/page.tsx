
import FeqTaps from "@/components/main/faq/FeqTaps";


export const metadata = {
    title: 'الأسئلة الشائعة',
    description: 'اعثر على إجابات لأكثر الأسئلة شيوعًا حول خدمات مراسل جدة العقاري، بما في ذلك الحجز، التواصل، وإدارة الحساب.',
};


export default function FaqPage() {

    return (
        <div className="py-[60px] lg:py-[120px] bg-white px-3">
            <div className="container">
                <div className="grid grid-cols-12 gap-4 justify-content-xxl-between">
                    <FeqTaps />
                </div>
            </div>
        </div>
    );
}