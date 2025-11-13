// FavoriteProjectsContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Property } from "@/types/global";

const STORAGE_KEY = "favoriteProjects";

interface FavoriteProjectsContextType {
  favorites: Map<string, Property>;
  favoritesCount: number;
  isFavorite: (id: string) => boolean;
  addFavorite: (property: Property) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (property: Property) => void;
}

const FavoriteProjectsContext = createContext<
  FavoriteProjectsContextType | undefined
>(undefined);

export const FavoriteProjectsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<Map<string, Property>>(new Map());
  const favoritesCount = useMemo(() => favorites.size, [favorites.size]);
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Property[] = JSON.parse(stored);
        const map = new Map(parsed.map((item) => [item.id, item]));
        setFavorites(map);
      } catch (err) {
        console.error("Failed to parse favorites from sessionStorage", err);
      }
    }
  }, []);

  const isFavorite = (id: string) => favorites.has(id);

  const addFavorite = (property: Property) => {
    const updated = new Map(favorites);
    updated.set(property.id, property);
    setFavorites(updated);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(updated.values()))
    );
  };

  const removeFavorite = (id: string) => {
    const updated = new Map(favorites);
    updated.delete(id);
    setFavorites(updated);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(updated.values()))
    );
  };

  const toggleFavorite = (property: Property) => {
    isFavorite(property.id)
      ? removeFavorite(property.id)
      : addFavorite(property);
  };

  return (
    <FavoriteProjectsContext.Provider
      value={{
        favorites,
        favoritesCount,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoriteProjectsContext.Provider>
  );
};

export function useFavoriteProjects() {
  const context = useContext(FavoriteProjectsContext);
  if (context === undefined) {
    throw new Error("Favorite Context was used outside provider");
  }

  return context;
}
