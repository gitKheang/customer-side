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
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import RestaurantSearchBar from "@/components/RestaurantSearchBar";
import RestaurantStoryViewer from "@/components/RestaurantStoryViewer";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
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
  const { notifications } = useBookings();
  const { getRestaurantStats } = useReviews();
  const { restaurants } = useRestaurantData();
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
    () => getRestaurantStoryGroups(restaurants),
    [restaurants],
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";
  const displayName = user?.name || (isGuest ? "Guest" : "Explorer");
  const heroTitle = displayName;
  const heroSubtitle = isGuest
    ? "Search restaurants and discover where to eat next."
    : "Search nearby restaurants and manage your bookings.";
  const normalizedUserEmail = user?.email?.trim().toLowerCase() || "";
  const unreadCount = notifications.filter(
    (notification) =>
      notification.audience === "customer" &&
      !notification.read &&
      normalizedUserEmail.length > 0 &&
      notification.recipientEmail?.toLowerCase() === normalizedUserEmail,
  ).length;

  const categories = [
    { emoji: "🍽️", label: "Restaurants" },
    { emoji: "🍺", label: "Pubs" },
    { emoji: "🎉", label: "Night clubs" },
  ];

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <main className="relative flex-1 min-h-0 overflow-y-auto pb-28 scrollbar-hide">
        <motion.section
          initial={isFigmaCapture ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isFigmaCapture ? { duration: 0 } : { duration: 0.24 }}
          className="safe-area-top relative overflow-hidden bg-[linear-gradient(135deg,#f5cf34_0%,#efc419_58%,#e5b90e_100%)] px-5 pb-5 pt-2"
        >
          <div className="pointer-events-none absolute -right-8 top-6 h-28 w-28 rounded-full bg-white/14 blur-2xl" />
          <div className="pointer-events-none absolute left-16 top-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[13px] font-medium text-[#5d4d1f]">
                {isGuest ? "Restaurant Discovery" : greeting}
              </p>

              <button
                onClick={() => navigate("/notifications")}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/18 text-[#2f2414] backdrop-blur-sm transition-transform active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2.2} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="mt-4">
              <h1 className="max-w-[240px] text-[26px] font-bold leading-tight text-[#2f2414]">
                {heroTitle}
              </h1>
              <p className="mt-1.5 text-[14px] leading-6 text-[#5f522f]">
                {heroSubtitle}
              </p>
            </div>

            <RestaurantSearchBar
              className="mt-4 z-20"
              formClassName="rounded-[20px] border border-white/45 bg-[#fff7dc] px-4 py-3 shadow-[0_10px_24px_rgba(118,90,12,0.10)]"
              inputClassName="text-[15px] placeholder:text-[#9b8b66]"
              disableSuggestionAnimation={isFigmaCapture}
              forceSuggestionsOpen={isFigmaCapture}
              placeholder="Enter postcode or town or city"
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSubmit={(value) =>
                navigate(
                  value ? `/search?q=${encodeURIComponent(value)}` : "/search",
                )
              }
              onSelectRestaurant={(restaurant) =>
                navigate(`/restaurant/${restaurant.id}`)
              }
            />
          </div>
        </motion.section>

        <div className="flex-1 overflow-hidden rounded-t-[26px] bg-background">
          {storyGroups.length > 0 && (
            <section className="px-5 pb-3 pt-4">
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
                        isFigmaCapture
                          ? { duration: 0 }
                          : { delay: 0.05 + index * 0.05 }
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
            </section>
          )}

          <section className="flex gap-2.5 px-5 py-4">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-95"
              >
                <span className="text-base">{category.emoji}</span>
                <span className="text-xs font-medium text-foreground">
                  {category.label}
                </span>
              </button>
            ))}
          </section>

          <section className="px-5 pb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                Top restaurants near you
              </h2>
              <button
                onClick={() => navigate("/search")}
                className="text-xs font-semibold text-primary"
              >
                See all
              </button>
            </div>

            <div className="space-y-5">
              {restaurants.slice(0, 3).map((restaurant, index) => {
                const stats = getRestaurantStats(restaurant);
                return (
                  <motion.button
                    key={restaurant.id}
                    initial={isFigmaCapture ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      isFigmaCapture
                        ? { duration: 0 }
                        : { delay: 0.15 + index * 0.1 }
                    }
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    className="w-full text-left group"
                  >
                    <div className="rounded-2xl">
                      <div className="relative h-44 overflow-hidden rounded-2xl">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 px-2.5 py-1 backdrop-blur-sm">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span className="text-xs font-bold text-foreground">
                            {stats.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start justify-between pb-1 pt-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {restaurant.name}
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

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFavorite(restaurant.id);
                            }}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Heart
                              className={`h-5 w-5 transition-colors ${
                                isFavorite(restaurant.id)
                                  ? "fill-destructive text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                          <span className="flex items-center gap-0.5 rounded-full border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                            Details <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        </div>
      </main>

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
