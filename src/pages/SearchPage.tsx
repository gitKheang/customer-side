import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";
import { mockRestaurants } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import FilterSheet, { Filters, defaultFilters } from "@/components/FilterSheet";
import { motion } from "framer-motion";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { goBackOr } from "@/lib/navigation";

const parseDistanceMiles = (distance: string) => {
  const value = parseFloat(distance);
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
};

const toShortDescription = (description: string) => {
  if (description.length <= 90) return description;
  return `${description.slice(0, 87).trim()}...`;
};

const SearchPage = () => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getRestaurantStats } = useReviews();
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const categories = [
    { emoji: "🔍", label: "All" },
    { emoji: "🍽️", label: "Restaurants" },
    { emoji: "🍺", label: "Pubs" },
    { emoji: "☕", label: "Café" },
    { emoji: "🎉", label: "Night clubs" },
  ];

  // Category to type mapping
  const categoryTypeMap: Record<string, string[]> = {
    All: [],
    Restaurants: ["restaurant"],
    Pubs: ["pub"],
    Café: ["cafe"],
    "Night clubs": ["pub", "nightclub"],
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = mockRestaurants.filter((r) => {
    const stats = getRestaurantStats(r);

    // Text search
    const matchesQuery =
      !normalizedQuery ||
      r.name.toLowerCase().includes(normalizedQuery) ||
      r.cuisine.toLowerCase().includes(normalizedQuery) ||
      r.address.toLowerCase().includes(normalizedQuery) ||
      r.description.toLowerCase().includes(normalizedQuery) ||
      r.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    // Category filter
    const matchesCategory =
      activeCategory === "All" ||
      (categoryTypeMap[activeCategory] || []).includes(r.type);

    // Distance filter (parse number from "0.3 miles" etc.)
    const distNum = parseFloat(r.distance);
    const matchesDistance = isNaN(distNum) || distNum <= filters.distance;

    // Rating filter
    let matchesRating = true;
    if (filters.rating !== "Any") {
      const minRating = parseFloat(filters.rating);
      matchesRating = stats.averageRating >= minRating;
    }

    // Cuisine filter
    const matchesCuisine =
      filters.cuisines.length === 0 ||
      filters.cuisines.some((c) =>
        r.tags.some((t) => t.toLowerCase() === c.toLowerCase()),
      );

    // Open Now quick filter
    const matchesOpenNow =
      !filters.quickFilters.includes("Open Now") || r.isOpen;

    // Favorites quick filter
    const matchesFavorites =
      !filters.quickFilters.includes("Favorites") || isFavorite(r.id);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesDistance &&
      matchesRating &&
      matchesCuisine &&
      matchesOpenNow &&
      matchesFavorites
    );
  });

  const sortedResults = [...filtered].sort((a, b) => {
    if (!normalizedQuery) {
      return parseDistanceMiles(a.distance) - parseDistanceMiles(b.distance);
    }
    return 0;
  });

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3">
        <button
          onClick={() => goBackOr(navigate, "/home")}
          className="rounded-full p-2 hover:bg-secondary transition-colors active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">
          Search nearby restaurants
        </h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2.5 px-5 py-2">
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-secondary px-4 py-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search restaurants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button
          onClick={() => setShowFilter(true)}
          className="rounded-2xl bg-primary p-3.5 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 py-2.5">
        {categories.map((c) => (
          <button
            key={c.label}
            onClick={() => setActiveCategory(c.label)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-medium transition-all active:scale-95 ${
              activeCategory === c.label
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/30"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <p className="py-2 text-xs text-muted-foreground">
          {normalizedQuery
            ? `We found (${sortedResults.length}) restaurant${sortedResults.length === 1 ? "" : "s"}`
            : `Nearby restaurants around you (${sortedResults.length})`}
        </p>

        <div className="space-y-5">
          {sortedResults.map((r, i) => {
            const stats = getRestaurantStats(r);
            return (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/restaurant/${r.id}`)}
                className="w-full text-left group"
              >
                <div className="relative h-44 overflow-hidden rounded-2xl">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs font-bold">
                      {stats.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start justify-between pt-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {r.name}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground truncate">
                      {r.address}
                    </p>
                    <p
                      className="mt-1 text-[11px] text-muted-foreground leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {toShortDescription(r.description)}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0 overflow-visible" />{" "}
                        Open Until {r.openUntil}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 overflow-visible" />{" "}
                        {r.distance}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(r.id);
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${isFavorite(r.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
                      />
                    </button>
                    <span className="flex items-center gap-0.5 text-[11px] font-medium text-primary border border-primary/20 rounded-full px-3 py-1">
                      Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <BottomNav />
      <FilterSheet
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
};

export default SearchPage;
