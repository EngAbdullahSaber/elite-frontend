'use client';

import { useEffect, useState } from "react";
import HeaderActions from "./HeaderActions";
import DesktopNavbar from "./DesktopNavbar";

type MainHeaderProps = {
  setShowMobileMenu: (val: boolean) => void;
  showMobileMenu: boolean;
};

export default function MainHeader({ setShowMobileMenu, showMobileMenu }: MainHeaderProps) {
  const [atTop, setAtTop] = useState(false);


  // Header elevation on scroll
  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock when drawer open
  useEffect(() => {
    const { body } = document;
    if (showMobileMenu) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [showMobileMenu]);

  return (
    <header
      className={`z-40 sticky top-0 left-0 border-y bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-shadow duration-300 ${atTop ? "shadow-md border-transparent" : "shadow-none"
        }`}
      role="banner"
    >
      <div className="container flex justify-between items-center relative px-3 py-2 lg:py-0 lg:px-0 mx-auto">
        <HeaderActions />
        <DesktopNavbar onOpenMobileMenu={() => setShowMobileMenu(true)} />
      </div>

      {/* Mobile only */}
      <div className="lg:hidden">
        {/* overlay */}
        <button
          aria-hidden={!showMobileMenu}
          tabIndex={-1}
          onClick={() => setShowMobileMenu(false)}
          className={`fixed inset-0 bg-black/30 transition-opacity ${showMobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />

      </div>
    </header>
  );
}
