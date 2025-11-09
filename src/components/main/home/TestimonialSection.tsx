'use client';

import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import SectionTitle from "@/components/shared/SectionTitle";
import SwiperPrevButton from "@/components/shared/SwiperPrevButton";
import SwiperNextButton from "@/components/shared/SwiperNextButton";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
    {
        stars: 5,
        message:
            "لقد كانت تجربتي مع شركة العقارات ممتازة من البداية حتى النهاية. ساعدوني في العثور على منزل يناسب احتياجاتي بكل احترافية.",
        name: "Jerome Bell",
        role: "مدير حسابات",
        imageUrl: "/users/user-2.webp",
    },
    {
        stars: 5,
        message:
            "خدمة رائعة وسريعة، فريق العمل كان متعاونًا جدًا وسهل التعامل معه. أنصح الجميع بالتعامل معهم.",
        name: "Leslie Alexander",
        role: "مستشار عقاري",
        imageUrl: "/users/user-3.webp",
    },
    {
        stars: 5,
        message:
            "وجدت العقار المثالي لعائلتي من خلال هذه المنصة. تجربة سلسة ودعم ممتاز طوال العملية.",
        name: "Robert Fox",
        role: "مستثمر عقاري",
        imageUrl: "/users/user-4.webp",
    },
];


export default function TestimonialSection() {
    return (
        <section className="bg-white py-[60px] lg:py-[120px] relative px-3  bg-[url('/pattern-01.png')] bg-contain bg-center ">
            {/* Background layers */}
            <div className="absolute inset-0 bg-white/80 z-[1]" />

            {/* Content wrapper */}
            <div className="relative z-[2]">
                {/* Decorative Images */}
                <Image
                    alt="image"
                    width={79}
                    height={81}
                    className="hidden lg:block absolute top-10 left-10"
                    src="/main/home/side.png"
                />
                <Image
                    alt="image"
                    width={208}
                    height={182}
                    className="hidden lg:block absolute top-0 right-0"
                    src="/main/home/side-2.png"
                />
                <Image
                    alt="image"
                    width={99}
                    height={86}
                    className="hidden lg:block absolute right-10 top-[60%]"
                    src="/main/home/testimonial-el-3.webp"
                />

                <div className="container">
                    <SectionTitle
                        title="آراء عملائنا"
                        bgColor="var(--primary-light)"
                        arrowTitle="شهادات"
                        description="يمكن شراء العقارات أو بيعها ,وهي فرصة استثمارية قيّمة. قيمة العقار تعتمد على الموقع والاستخدام."
                    />

                    <div className="relative">
                        {/* Navigation Buttons */}
                        <SwiperPrevButton className="testimonial-prev absolute top-[40%] left-2 lg:left-10 " />
                        <SwiperNextButton className="testimonial-next absolute top-[40%] right-2 lg:right-10 " />

                        {/* Swiper Carousel */}
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                nextEl: ".testimonial-next",
                                prevEl: ".testimonial-prev",
                            }}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={true}
                            className="swiper max-w-[856px] bg-[#EBEBFD] rounded-xl px-3 lg:px-5 xl:px-10 py-3 xl:py-8 text-center mx-3"
                        >
                            {testimonials.map((review, index) => (
                                <SwiperSlide key={index} className="py-7">
                                    <TestimonialCard
                                        stars={review.stars}
                                        message={review.message}
                                        name={review.name}
                                        role={review.role}
                                        imageUrl={review.imageUrl}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}
