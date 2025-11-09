"use client";

import Link from "next/link";

export default function FooterRights() {
  const currentYear = new Date().getFullYear();

  return (
    <p className="m-0 text-center lg:text-start">
      جميع الحقوق محفوظة © {currentYear}.
      <span className="text-tertiary"> مدعوم من </span>
      <Link href="" target="_blank" className="text-tertiary hover:underline">
        Elite Gate
      </Link>
      .
    </p>
  );
}
