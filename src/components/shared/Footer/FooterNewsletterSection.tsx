"use client";
import { GoPaperAirplane } from "react-icons/go";

export default function FooterNewsletterSection() {
  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-3">
      <h4 className="text-2xl font-semibold mb-6">النشرة البريدية</h4>
      <p className="mb-6 text-neutral-300">
        اشترك في النشرة البريدية للحصول على آخر التحديثات والأخبار
      </p>
      <div className="p-2 rounded-full border border-neutral-200">
        <form action="#" className="flex items-center">
          <input
            type="text"
            placeholder="عنوان البريد الإلكتروني"
            className="w-full border-0 bg-transparent text-neutral-300 px-3 py-2 placeholder:text-neutral-300 focus:outline-none"
          />
          <button
            type="button"
            className="grid place-content-center px-6 py-3 rounded-full bg-tertiary border-0"
          >
            <GoPaperAirplane className="w-5 h-5 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
