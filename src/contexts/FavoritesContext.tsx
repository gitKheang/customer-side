/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPreferredIdentifier } from "@/lib/authValidation";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};

const FAVORITES_KEY = "rra_favorites";

type FavoritesStore = Record<string, string[]>;

const LEGACY_SCOPE = "legacy";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isGuest, isReady } = useAuth();
  const [favoriteStore, setFavoriteStore] = useState<FavoritesStore>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "{}");
      if (Array.isArray(parsed)) {
        return { [LEGACY_SCOPE]: parsed as string[] };
      }
      return parsed && typeof parsed === "object"
        ? (parsed as FavoritesStore)
        : {};
    } catch {
      return {};
    }
  });

  const activeScope = !isReady
    ? ""
    : isAuthenticated
      ? `${user?.role || "customer"}:${getPreferredIdentifier(user?.email, user?.phone)}`
      : isGuest
        ? "guest"
        : "";

  const legacyFavorites = favoriteStore[LEGACY_SCOPE] ?? [];
  const favorites = activeScope
    ? favoriteStore[activeScope] ?? legacyFavorites
    : legacyFavorites;

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteStore));
  }, [favoriteStore]);

  const toggleFavorite = (id: string) => {
    if (!activeScope) return;

    setFavoriteStore((prev) => {
      const currentFavorites = prev[activeScope] ?? prev[LEGACY_SCOPE] ?? [];
      const nextFavorites = currentFavorites.includes(id)
        ? currentFavorites.filter((favoriteId) => favoriteId !== id)
        : [...currentFavorites, id];

      return {
        ...prev,
        [activeScope]: nextFavorites,
      };
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
