import SectionForm from "@/components/main/signin/SectionForm";
import Image from "next/image";

import React from "react";

export const metadata = {
  title: "تسجيل الدخول",
  description:
    "قم بتسجيل الدخول إلى حسابك للوصول إلى خدمات مراسل جدة العقاري، وإدارة حجوزاتك ومشاريعك بسهولة.",
};

export default function SigninPage() {
  return (
    <section className="py-20 bg-[var(--bg-1)] mt-4 lg:mt-16">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-stretch justify-between rounded-2xl custom-shadow overflow-hidden">
          <SectionForm />
          <div className="w-full lg:w-[50%] bg-primary-light flex items-center justify-center">
            <Image
              src="/main/admin-signin.png"
              alt="تسجيل الدخول"
              width={667}
              height={639}
              className="max-w-full lg:max-w-[500px] xl:max-w-[550px] rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
