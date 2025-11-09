import PrimaryButton from "@/components/shared/Button";
import SectionTitle from "@/components/shared/SectionTitle";
import { BsArrowLeft } from "react-icons/bs";


export default function CallToActionSection() {
    return (
        <section className="bg-bg-2  px-3 xl:px-0 relative isolate  ">

            {/* Content wrapper */}
            <div className="bg-bg-2  relative z-[2]">

                <div className="bg-bg-2  !ml-0 z-10 relative mt-[110px] after:bg-[url('/main/home/cta-bg.png')] after:absolute after:left-0 3xl:after:left-[12%] 4xl:after:left-[16%] after:w-[98%] after:mx-auto lg:after:w-[84%] after:h-[388px] after:right-0 after:bottom-0 after:bg-[#c2c3f7]">
                    <div className="cta-after-flip container  py-[60px] z-20 relative after:absolute lg:after:bg-[url('/main/home/cta-img.png')] after:bg-right-bottom after:bg-no-repeat after:w-full after:h-full after:bottom-0 after:pointer-events-none">

                        <div className="xl:pl-[90px] px-3">

                        </div>
                        <SectionTitle
                            title="  ابحث عن عقارك المثالي بمساعدة خبرائنا"
                            arrowTitle=" دعوة لاتخاذ إجراء"
                            bgColor="white"
                            className="!mr-[30px] md:!mr-[60px] lg:!mr-[100px] !items-start !justify-end text-right min-h-[240px]"

                        >
                            <div className="max-w-max mt-8">
                                <PrimaryButton
                                    href="/contact-us"
                                    className="flex items-center gap-2"
                                >
                                    اتصل بنا <BsArrowLeft />
                                </PrimaryButton>

                            </div>
                        </SectionTitle>
                    </div>
                </div>
            </div>
        </section >
    );
}
