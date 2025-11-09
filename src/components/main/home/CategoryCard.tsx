"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { BsArrowLeft } from "react-icons/bs";

type CategoryCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
};

export default function CategoryCard({ icon, title, description, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group relative flex flex-col border rounded-2xl max-w-[306px] cursor-pointer transition-all duration-300 bg-white hover:-translate-y-1 hover:shadow-xl overflow-hidden">
      {/* Accent bar */}
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-primary to-tertiary opacity-70" />
      <div className="flex-1 p-7 lg:p-8 bg-white group-hover:bg-primary/95 rounded-t-2xl transition-colors">
        <div className="text-[48px] leading-none mb-2 group-[&:hover>*]:text-white">
          {icon}
        </div>
        <h4 className="font-bold text-xl pt-1 pb-2 text-neutral-800 group-hover:text-white">
          {title}
        </h4>
        <p className="text-neutral-600 group-hover:text-white/90 text-sm leading-7">{description}</p>
      </div>
      <div className="bg-bg-2 p-6 rounded-b-2xl group-hover:bg-[#212391] group-hover:text-white transition-colors">
        <div className="flex items-center gap-2 text-base font-medium">
          <span>اقرأ المزيد</span>
          <BsArrowLeft className="mt-0.5" />
        </div>
      </div>
    </Link>
  );
}
