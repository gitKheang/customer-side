import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bell,
  Clock,
  MapPin,
  Heart,
  Star,
  ChevronRight,
} from "lucide-react";
import { mockRestaurants } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import RestaurantSearchBar from "@/components/RestaurantSearchBar";
import RestaurantStoryViewer from "@/components/RestaurantStoryViewer";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { useRestaurantStoryState } from "@/hooks/useRestaurantStoryState";
import {
  formatStoryAge,
  getRestaurantStoryGroups,
} from "@/lib/restaurantStories";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isGuest } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { unreadCount } = useBookings();
  const { getRestaurantStats } = useReviews();
  const { isRestaurantStorySeen, markRestaurantStorySeen } =
    useRestaurantStoryState();
  const isFigmaCapture =
    searchParams.get("capture") === "1" || searchParams.get("figma") === "1";
  const captureSearchQuery =
    searchParams.get("search") ??
    searchParams.get("q") ??
    (isFigmaCapture ? "p" : "");
  const [searchQuery, setSearchQuery] = useState(captureSearchQuery);
  const [activeStoryRestaurantId, setActiveStoryRestaurantId] = useState<
    string | undefined
  >();
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const storyGroups = useMemo(
    () => getRestaurantStoryGroups(mockRestaurants),
    [],
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning!"
      : hour < 18
        ? "Good afternoon!"
        : "Good evening!";
  const displayName = user?.name || (isGuest ? "Guest" : "");
  const userInitial = user?.name?.[0]?.toUpperCase() || (isGuest ? "G" : "W");

  const categories = [
    { emoji: "🍽️", label: "Restaurants" },
    { emoji: "🍺", label: "Pubs" },
    { emoji: "🎉", label: "Night clubs" },
  ];

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/10 overflow-hidden">
            {user?.photo ? (
              <img
                src={user.photo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{greeting}</h1>
            <p className="text-[11px] text-muted-foreground">
              {isGuest ? "Sign in to book tables" : `Welcome, ${displayName}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/notifications")}
          className="relative rounded-full border border-border p-2.5 hover:bg-secondary transition-colors"
        >
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive ring-2 ring-background flex items-center justify-center text-[9px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {/* Search */}
        <div
          className={`sticky top-0 z-20 px-5 py-2.5 ${
            isFigmaCapture
              ? "bg-background"
              : "bg-background/95 backdrop-blur"
          }`}
        >
          <RestaurantSearchBar
            className="z-20"
            disableSuggestionAnimation={isFigmaCapture}
            forceSuggestionsOpen={isFigmaCapture}
            placeholder="Enter postcode or town or city"
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSubmit={(value) =>
              navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search")
            }
            onSelectRestaurant={(restaurant) =>
              navigate(`/restaurant/${restaurant.id}`)
            }
          />
        </div>

        {storyGroups.length > 0 && (
          <div className="px-5 pb-3 pt-1">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Latest stories
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Quick updates from restaurants near you
                </p>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {storyGroups.map((group, index) => {
                const isSeen = isRestaurantStorySeen(group.restaurant);

                return (
                  <motion.button
                    key={group.restaurant.id}
                    initial={isFigmaCapture ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      isFigmaCapture ? { duration: 0 } : { delay: 0.05 + index * 0.05 }
                    }
                    onClick={() => {
                      setActiveStoryRestaurantId(group.restaurant.id);
                      setIsStoryViewerOpen(true);
                    }}
                    className="w-[76px] shrink-0 text-left"
                  >
                    <div
                      className={`inline-flex rounded-[1rem] p-[2px] transition-all ${
                        isSeen
                          ? "bg-border/90"
                          : "bg-[linear-gradient(145deg,#f1d474_0%,#ddb122_55%,#bc8d0a_100%)] shadow-[0_10px_18px_-12px_rgba(149,111,10,0.75)]"
                      }`}
                    >
                      <div
                        className={`rounded-[0.85rem] p-[1px] ${
                          isSeen ? "bg-background" : "bg-[#f8efc7]"
                        }`}
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-[0.78rem]">
                          <img
                            src={group.latestStory.image}
                            alt={group.restaurant.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-background/90 px-1.5 py-0.5 text-[9px] font-semibold text-foreground">
                            {group.stories.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 truncate text-[11px] font-semibold text-foreground">
                      {group.restaurant.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatStoryAge(group.latestStory.postedAt)} ago
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2.5 px-5 py-4">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate("/search")}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95"
            >
              <span className="text-base">{c.emoji}</span>
              <span className="text-xs font-medium text-foreground">
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Top Restaurants */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">
              Top restaurants in London
            </h2>
            <button
              onClick={() => navigate("/search")}
              className="text-xs font-semibold text-primary"
            >
              See all
            </button>
          </div>

          <div className="space-y-5">
            {mockRestaurants.slice(0, 3).map((r, i) => {
              const stats = getRestaurantStats(r);
              return (
                <motion.button
                  key={r.id}
                  initial={isFigmaCapture ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    isFigmaCapture ? { duration: 0 } : { delay: 0.15 + i * 0.1 }
                  }
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="w-full text-left group"
                >
                  <div className="rounded-2xl">
                    <div className="relative h-44 overflow-hidden rounded-2xl">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-xs font-bold text-foreground">
                          {stats.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start justify-between pt-3 pb-1">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {r.name}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
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
                          className="p-1 hover:scale-110 transition-transform"
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
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
      <RestaurantStoryViewer
        groups={storyGroups}
        initialRestaurantId={activeStoryRestaurantId}
        open={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
        onRestaurantSeen={markRestaurantStorySeen}
        primaryActionLabel="Book Table"
        onPrimaryAction={(restaurant) => navigate(`/book/${restaurant.id}`)}
      />
    </div>
  );
};

export default HomePage;
