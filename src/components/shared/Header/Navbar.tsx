"use client";

import NavMenuItem from "./NavMenuItem";
import { NavItem } from "@/types/global";
import { useEffect, useState } from "react";

// Base navigation items that are always visible
const baseNavigation: NavItem[] = [
  {
    name: "الرئيسية",
    href: "/",
  },
  {
    name: "العقارات",
    children: [
      {
        name: "فلل",
        href: "/projects?type=villas",
      },
      { name: "شقق", href: "/projects?type=apartments" },
      { name: "أراضي سكنية", href: "/projects?type=residential-land" },
      { name: "أراضي تجارية", href: "/projects?type=commercial-land" },
      { name: "مكاتب إدارية", href: "/projects?type=offices" },
    ],
  },
  {
    name: "الصفحات",
    children: [
      { name: "من نحن", href: "/about-us" },
      { name: "اتصل بنا", href: "/contact-us" },
      { name: "المفضلة", href: "/favorites" },
      { name: "الأسئلة الشائعة", href: "/faq" },
      { name: "سياسة الخصوصية", href: "/privacy" },
      { name: "الشروط والأحكام", href: "/terms" },
    ],
  },
];

type NavbarProps = {
  currentLevel?: number;
  onCloseMobileMenu?: () => void;
  onChangeLevel?: (val: number | undefined) => void;
};

export default function Navbar({
  currentLevel,
  onChangeLevel,
  onCloseMobileMenu,
}: NavbarProps) {
  const [navigation, setNavigation] = useState<NavItem[]>(baseNavigation);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from sessionStorage
    const getUserRole = () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          return user.userType || null;
        }
      } catch (error) {
        console.error("Error parsing user data from sessionStorage:", error);
      }
      return null;
    };

    const role = getUserRole();
    setUserRole(role);

    // Update navigation based on user role
    const updatedNavigation = [...baseNavigation];

    // Add dashboard menu based on user role
    if (role) {
      const dashboardMenu: NavItem = {
        name: "لوحة التحكم",
        children: [],
      };

      switch (role) {
        case "admin":
          dashboardMenu.children = [
            { name: "لوحة تحكم الادمن", href: "/dashboard/admin" },
          ];
          break;
        case "agent":
          dashboardMenu.children = [
            { name: "لوحة تحكم الوسيط", href: "/dashboard/agent" },
          ];
          break;
        case "customer":
          break;
        case "marketer":
          dashboardMenu.children = [
            { name: "لوحة تحكم المسوق", href: "/dashboard/marketer" },
          ];
          break;
        default:
          // For unknown roles, don't show dashboard menu
          break;
      }

      // Only add dashboard menu if it has children
      if (dashboardMenu.children && dashboardMenu.children.length > 0) {
        updatedNavigation.push(dashboardMenu);
      }
    }

    setNavigation(updatedNavigation);
  }, []);

  // Optional: Listen for storage changes to update role dynamically
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user.userType || null);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error handling storage change:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event if you update user data in your app
    window.addEventListener("userDataChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userDataChanged", handleStorageChange);
    };
  }, []);

  return (
    <ul className="flex flex-col lg:flex-row menus absolute left-0 lg:top-full bg-white lg:bg-transparent w-full lg:w-auto lg:static px-2 lg:px-0">
      {/* Nested Dropdown Example */}
      {navigation.map((item, index) => (
        <NavMenuItem
          key={index}
          item={item}
          level={index}
          currentLevel={currentLevel}
          onChangeLevel={(val) => onChangeLevel?.(val)}
          isMainMenu={true}
          onCloseMobileMenu={onCloseMobileMenu}
        />
      ))}
    </ul>
  );
}
