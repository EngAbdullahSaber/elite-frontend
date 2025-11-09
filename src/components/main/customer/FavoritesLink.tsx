"use client";
import SidebarLink from "@/components/shared/SidebarLink";
import { useFavoriteProjects } from "@/contexts/FavoriteProjectsContext";
import { FaHeart } from "react-icons/fa";

export default function FavoritesLink() {
  const { favoritesCount } = useFavoriteProjects();

  return (
    <SidebarLink
      href="/favorites"
      icon={<FaHeart />}
      badge={favoritesCount?.toString()}
    >
      المفضلة
    </SidebarLink>
  );
}
