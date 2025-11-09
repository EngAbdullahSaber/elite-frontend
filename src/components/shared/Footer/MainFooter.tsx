"use client";

import FooterLogoSection from "./FooterLogoSection";
import FooterLinksSection from "./FooterLinksSection";
import FooterContactSection from "./FooterContactSection";
import FooterNewsletterSection from "./FooterNewsletterSection";
import FooterBottom from "./FooterBottom";

export default function MainFooter() {
  return (
    <footer className="bg-[#091E43] text-white mt-auto bg-[url('/pattern-02.png')] bg-contain bg-center ">
      {/* Background layers */}

      <div className="py-[20px] lg:py-[50px]">
        <div className="container">
          <div className="grid grid-cols-12 gap-6 px-3 xl:px-0">
            <FooterLogoSection />
            <FooterLinksSection />
            <FooterContactSection />
            <FooterNewsletterSection />
          </div>
        </div>
      </div>
      <div className="container">
        <FooterBottom />
      </div>
    </footer>
  );
}
