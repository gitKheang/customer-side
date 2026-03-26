import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import RestaurantSearchBar from "@/components/RestaurantSearchBar";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { goBackOr } from "@/lib/navigation";
import { getMatchingRestaurants } from "@/lib/restaurantSearch";

const toShortDescription = (description: string) => {
  if (description.length <= 90) return description;
  return `${description.slice(0, 87).trim()}...`;
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getRestaurantStats } = useReviews();
  const { restaurants } = useRestaurantData();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const results = useMemo(
    () => getMatchingRestaurants(restaurants, query),
    [restaurants, query],
  );
  const trimmedQuery = query.trim();

  const handleSearchSubmit = (value: string) => {
    if (!value) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: value });
  };

  return (
    <div className="relative flex h-full min-w-0 flex-col overflow-x-hidden bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-3">
        <button
          onClick={() => goBackOr(navigate, "/home")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">
          Search nearby restaurants
        </h1>
      </div>

      <div className="px-5 py-2">
        <RestaurantSearchBar
          autoFocus
          placeholder="Search restaurants..."
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearchSubmit}
          onSelectRestaurant={(restaurant) =>
            navigate(`/restaurant/${restaurant.id}`)
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-2 scrollbar-hide">
        <p className="py-2 text-xs text-muted-foreground">
          {trimmedQuery
            ? `Showing ${results.length} restaurant${results.length === 1 ? "" : "s"} near "${trimmedQuery}"`
            : `Nearest restaurants around you (${results.length})`}
        </p>

        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border px-5 py-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              No restaurants matched your search.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another restaurant name, cuisine, or area.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {results.map((restaurant, index) => {
              const stats = getRestaurantStats(restaurant);

              return (
                <motion.button
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="group w-full text-left"
                >
                  <div className="relative h-44 overflow-hidden rounded-2xl">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 px-2.5 py-1 backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs font-bold">
                        {stats.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 pt-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {restaurant.name}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">
                        {restaurant.address}
                      </p>
                      <p
                        className="mt-1 text-[11px] leading-relaxed text-muted-foreground"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {toShortDescription(restaurant.description)}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0 overflow-visible" />{" "}
                          Open Until {restaurant.openUntil}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0 overflow-visible" />{" "}
                          {restaurant.distance}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(restaurant.id);
                        }}
                        className="transition-transform hover:scale-110"
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${isFavorite(restaurant.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
                        />
                      </button>
                      <span className="flex items-center gap-0.5 rounded-full border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                        Details <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
