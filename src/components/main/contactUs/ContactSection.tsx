import MapCard from "@/components/shared/MapCard";
import ContactForm from "./ContactForm";


export default function ContactSection() {
    return (
        <div className="pb-[60px] lg:pb-[120px] pt-4 bg-[var(--bg-2)] px-3">

            <div className="container">
                <div className="grid grid-cols-12 gap-4 justify-center ">

                    <div className="col-span-12 lg:col-span-6 order-2 lg:order-none">
                        <ContactForm />
                    </div>
                    <div className="col-span-12 lg:col-span-6 order-1 lg:order-none">
                        <MapCard
                            title="موقعنا"
                            subTitle="الفرع الرئيسي - جدة"
                            lat={21.543333}
                            lng={39.172778}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}