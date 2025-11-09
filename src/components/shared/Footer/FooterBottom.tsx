"use client";

import Link from "next/link";
import FooterRights from "./FooterRights";

export default function FooterBottom() {
  const links = [
    { label: "سياسة الخصوصية", href: "/privacy" },
    { label: "الشروط والأحكام", href: "/terms" },
  ];

  return (
    <div className="py-8 border-t border-[#3638bd] text-white">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <FooterRights />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <ul className="flex items-center flex-wrap gap-6 justify-center lg:justify-end">
            {links.map((link, i) => (
              <li key={i}>
                <Link
                  href={link.href}
                  className="hover:text-secondary duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
