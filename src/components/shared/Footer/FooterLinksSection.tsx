"use client";

import Link from "next/link";

export default function FooterLinksSection() {
  const links = [
    { label: "من نحن", href: "/about-us" },
    { label: "العقارات", href: "/projects" },
    { label: "الأسئلة الشائعة", href: "/faq" },
    { label: "اتصل بنا", href: "/contact-us" },
  ];

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-3">
      <h4 className="text-2xl font-semibold mb-6">روابط سريعة</h4>
      <ul className="flex flex-col gap-2">
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
  );
}
