"use client";

import { NavItem } from "@/types/global";
import Link from "next/link";
import { SlArrowDown, SlArrowLeft } from "react-icons/sl";
import { useEffect, useState } from "react";

type Props = {
  item: NavItem;
  level: number;
  currentLevel?: number;
  isMainMenu?: boolean;
  onCloseMobileMenu?: () => void;
  onChangeLevel?: (val: number | undefined) => void;
};

export default function NavMenuItem({
  item,
  level = 0,
  isMainMenu = false,
  currentLevel,
  onChangeLevel,
  onCloseMobileMenu,
}: Props) {
  const [menuMobileOpen, setMenuMobileOpen] = useState<boolean>(false);
  function handleShowMobileMenu() {
    if (level !== currentLevel) {
      onChangeLevel?.(level);
    }
    setMenuMobileOpen((p) => !p);
  }

  function handleNavigate() {
    onChangeLevel?.(undefined);
    onCloseMobileMenu?.();
  }

  useEffect(() => {
    if (level !== currentLevel && menuMobileOpen) {
      setMenuMobileOpen(false);
    }
  }, [currentLevel]);

  const dropdownClass = isMainMenu
    ? "top-full lg:absolute right-0 z-10 bg-white"
    : "lg:absolute right-full z-10 bg-white top-0";

  return (
    <li className="relative menu-items cursor-pointer ">
      {item.children ? (
        <>
          <span
            className="flex items-center justify-between gap-[5px]"
            onClick={handleShowMobileMenu}
            aria-haspopup="menu"
            aria-expanded="false"
          >
            {item.name}
            {isMainMenu ? (
              <SlArrowDown
                size={13}
                className={`mt-1  transform transition-transform duration-300  ${
                  menuMobileOpen ? "max-lg:rotate-0" : "max-lg:rotate-90"
                }`}
              />
            ) : (
              <SlArrowLeft
                size={13}
                className={`transform transition-transform duration-300 ${
                  menuMobileOpen ? "max-lg:-rotate-90" : "max-lg:rotate-0"
                }`}
              />
            )}
          </span>
          <ul
            className={`my-dropdown max-lg:overflow-hidden max-lg:transition-[max-height,padding-top] max-lg:duration-300 max-lg:ease-in-out shadow-md min-w-[200px] max-lg:max-h-0 ${
              menuMobileOpen ? "max-lg:max-h-96 max-lg:pt-4" : ""
            } lg:hidden ${dropdownClass}`}
          >
            {item.children.map((child, index) => (
              <NavMenuItem
                key={index}
                item={child}
                level={level}
                currentLevel={currentLevel}
                onChangeLevel={onChangeLevel}
                onCloseMobileMenu={onCloseMobileMenu}
              />
            ))}
          </ul>
        </>
      ) : (
        <Link
          href={item.href || "#"}
          className="block"
          onClick={handleNavigate}
        >
          {item.name}
        </Link>
      )}
    </li>
  );
}
