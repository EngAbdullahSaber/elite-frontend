import ListProperty from "./ListProperty";
import SectionTitle from "@/components/shared/SectionTitle";
import { properties } from "@/constants/projects";



export default function RecentlyAddedPropertySection() {
    return (
        <section className="bg-[var(--bg-2)] py-[60px] lg:py-[120px] relative  bg-[url('/pattern-01.png')] bg-contain bg-center ">
            {/* Background layers */}
            <div className="absolute inset-0 bg-white/80 z-[1]" />

            {/* Content wrapper */}
            <div className="relative z-[2]">
                <div className="container">
                    <SectionTitle
                        arrowTitle="المشاريع"
                        title="أحدث المشاريع"
                        description="اكتشف أحدث الوحدات العقارية المضافة حديثًا — فرص سكنية واستثمارية مختارة بعناية لتناسب تطلعاتك."
                    />
                    <ListProperty properties={properties} max={4} />
                </div>
            </div>
        </section>
    );
}
