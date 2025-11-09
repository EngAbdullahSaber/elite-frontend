import PropertiesDataView from "@/components/main/projects/PropertiesDataView";

export const metadata = {
    title: 'المشاريع العقارية',
    description: 'استعرض أحدث المشاريع العقارية المتاحة للبيع أو الإيجار، واختر من بين الفلل، الشقق، الأراضي والمزيد عبر منصة مراسل جدة العقاري.',
};


export default function ProjectsPage() {
    return (
        <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
            <PropertiesDataView />
        </div>
    );
}