import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Review } from "@/data/mockData";
import {
  ArrowLeft,
  CirclePlay,
  Heart,
  Star,
  Clock,
  MapPin,
  Info,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantStoryViewer from "@/components/RestaurantStoryViewer";
import { motion } from "framer-motion";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { useRestaurantStoryState } from "@/hooks/useRestaurantStoryState";
import {
  formatStoryAge,
  getRestaurantStoryGroups,
  hasRestaurantStories,
} from "@/lib/restaurantStories";
import { goBackOr } from "@/lib/navigation";
import mapPreview from "@/assets/map/Screenshot 2026-03-08 at 12.04.44 in the afternoon.png";
import {
  DEFAULT_DISCOVERY_GUESTS,
  formatDateISO,
  getBookableSlots,
  getBookingDateTime,
} from "@/lib/bookingAvailability";

const formatReviewCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${count}`;
};

const formatReviewDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRestaurantById } = useRestaurantData();
  const restaurant = getRestaurantById(id || "");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { bookings } = useBookings();
  const { isRestaurantStorySeen, markRestaurantStorySeen } =
    useRestaurantStoryState();
  const {
    getRestaurantStats,
    getReviewsForRestaurant,
    submitReview,
    hasUserReviewed,
  } = useReviews();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const storyGroups = restaurant ? getRestaurantStoryGroups([restaurant]) : [];

  if (!restaurant) {
    return (
      <div className="flex h-full items-center justify-center text-foreground">
        Not found
      </div>
    );
  }

  const ratingStats = getRestaurantStats(restaurant);
  const latestStory = restaurant.stories?.[restaurant.stories.length - 1];
  const showStoryEntry = hasRestaurantStories(restaurant);
  const restaurantReviews = getReviewsForRestaurant(restaurant.id);
  const userEmail = user?.email?.trim().toLowerCase() || "";
  const isSignedInUser = isAuthenticated && !isGuest && !!userEmail;
  const userAlreadyReviewed = isSignedInUser
    ? hasUserReviewed(restaurant.id, userEmail)
    : false;
  const photoGallery = [restaurant.image, ...restaurant.menu.map((m) => m.image)];
  const todayIso = formatDateISO(new Date());
  const bookableSlotsToday = getBookableSlots({
    slots: restaurant.availableSlots,
    bookings,
    restaurantId: restaurant.id,
    date: todayIso,
    guests: DEFAULT_DISCOVERY_GUESTS,
  });
  const bookableSlotsTodaySet = new Set(bookableSlotsToday);
  const hasAvailabilityToday = bookableSlotsToday.length > 0;

  const existingUserReview = isSignedInUser
    ? restaurantReviews.find(
        (review) => review.authorEmail.toLowerCase() === userEmail,
      )
    : undefined;
  const hasCompletedVisit = isSignedInUser
    ? bookings.some((booking) => {
        if (booking.restaurantId !== restaurant.id) return false;
        if (booking.bookingEmail.toLowerCase() !== userEmail) return false;

        if (booking.status === "completed") return true;
        if (booking.status === "cancelled") return false;

        const bookingDateTime = getBookingDateTime(booking.date, booking.time);
        return !Number.isNaN(bookingDateTime.getTime()) && bookingDateTime < new Date();
      })
    : false;

  const handleOpenReviewForm = () => {
    if (!isSignedInUser) {
      navigate("/signin");
      return;
    }

    if (!hasCompletedVisit) {
      navigate("/history");
      return;
    }

    if (!showReviewForm) {
      setReviewRating(existingUserReview?.rating ?? 0);
      setReviewComment(existingUserReview?.comment ?? "");
    }

    setShowReviewForm((prev) => !prev);
  };

  const handleSubmitReview = () => {
    if (!isSignedInUser || !user) return;
    if (!hasCompletedVisit) return;

    const result = submitReview({
      restaurantId: restaurant.id,
      rating: reviewRating,
      comment: reviewComment,
      authorName: user.name,
      authorEmail: user.email,
    });

    if (!result.success) return;

    setShowReviewForm(false);
  };

  const isVerifiedReview = (review: Review) => {
    return bookings.some(
      (booking) =>
        booking.restaurantId === review.restaurantId &&
        booking.status === "completed" &&
        booking.bookingEmail.toLowerCase() === review.authorEmail.toLowerCase(),
    );
  };

  const handleMoreInfo = () => {
    if (!showMoreInfo) {
      setShowMoreInfo(true);
      window.setTimeout(() => {
        const section = document.getElementById("restaurant-more-info");
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }

    const section = document.getElementById("restaurant-more-info");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openDirections = () => {
    const destination = encodeURIComponent(restaurant.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${destination}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="relative h-[40%] min-h-[320px]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

        <div className="absolute top-0 left-0 right-0 safe-area-top flex items-center justify-between px-5 pt-1">
          <button
            onClick={() => goBackOr(navigate, "/home")}
            className="rounded-full bg-background/15 backdrop-blur-md p-2.5 active:scale-90 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-background" />
          </button>
          <button
            onClick={() => toggleFavorite(restaurant.id)}
            className="rounded-full bg-background/15 backdrop-blur-md p-2.5 active:scale-90 transition-transform"
          >
            <Heart
              className={`h-5 w-5 transition-all ${isFavorite(restaurant.id) ? "fill-destructive text-destructive scale-110" : "text-background"}`}
            />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-2xl font-bold text-background leading-tight">
            {restaurant.name}
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-background/80">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Open now
            </span>
            <span className="text-background/40">•</span>
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>
              {ratingStats.averageRating.toFixed(1)} (
              {formatReviewCount(ratingStats.reviewCount)} Reviews)
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {showStoryEntry && latestStory && (
              <button
                onClick={() => setIsStoryViewerOpen(true)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium backdrop-blur-md active:scale-95 transition-transform ${
                  isRestaurantStorySeen(restaurant)
                    ? "bg-background/15 text-background"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                }`}
              >
                <CirclePlay className="h-3.5 w-3.5" />
                {isRestaurantStorySeen(restaurant) ? "View Story" : "New Story"}
                <span className="opacity-70">
                  {formatStoryAge(latestStory.postedAt)} ago
                </span>
              </button>
            )}
            <button
              onClick={handleMoreInfo}
              className="flex items-center gap-1.5 rounded-full bg-background/15 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-background active:scale-95 transition-transform"
            >
              <Info className="h-3.5 w-3.5" /> More info
            </button>
            <button
              onClick={() => {
                openDirections();
              }}
              className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2.5 text-xs font-semibold text-foreground active:scale-95 transition-transform"
            >
              <Navigation className="h-3.5 w-3.5" /> Get Directions
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide -mt-2">
        <div className="rounded-t-3xl bg-background pt-6 px-5 pb-5 space-y-5">
          <div id="restaurant-description">
            <h3 className="text-sm font-bold text-foreground">
              About this restaurant
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {restaurant.description}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span>{restaurant.address}</span>
              <span className="text-border">•</span>
              <Clock className="h-3 w-3 text-primary" />
              <span>Open until {restaurant.openUntil}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Opening hours: Daily service until {restaurant.openUntil}
            </p>
          </div>

          {showMoreInfo && (
            <motion.div
              id="restaurant-more-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border p-4"
            >
              <h3 className="text-sm font-bold text-foreground">About this place</h3>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Cuisine:</span>{" "}
                  {restaurant.cuisine}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Price Range:</span>{" "}
                  {restaurant.priceRange}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Address:</span>{" "}
                  {restaurant.address}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Rating Summary:
                  </span>{" "}
                  {ratingStats.averageRating.toFixed(1)} from{" "}
                  {formatReviewCount(ratingStats.reviewCount)} reviews
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <div>
            <h3 className="text-sm font-bold text-foreground">Photos</h3>
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {photoGallery.map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={photo}
                    alt={`${restaurant.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">Map location</h3>
              <button
                onClick={openDirections}
                className="text-[11px] font-semibold text-primary"
              >
                Open in Google Maps
              </button>
            </div>
            <button
              onClick={openDirections}
              className="mt-3 w-full rounded-xl border border-border bg-secondary/50 p-3 text-left"
            >
              <div className="relative h-28 overflow-hidden rounded-lg border border-border">
                <img
                  src={mapPreview}
                  alt="Map preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-foreground/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm">
                    Tap map for directions
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs font-medium text-foreground">
                {restaurant.address}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Directions use your current location as the starting point.
              </p>
            </button>
          </div>

          <div className="rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Ratings & Reviews
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {ratingStats.averageRating.toFixed(1)} average from{" "}
                  {formatReviewCount(ratingStats.reviewCount)} reviews
                </p>
              </div>
              <div className="rounded-xl bg-warning/10 px-3 py-2 text-right">
                <p className="text-lg font-bold text-foreground leading-none">
                  {ratingStats.averageRating.toFixed(1)}
                </p>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < Math.round(ratingStats.averageRating) ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Button
                variant={isSignedInUser && hasCompletedVisit ? "outline" : "cta"}
                size="sm"
                className="w-full"
                onClick={handleOpenReviewForm}
              >
                {!isSignedInUser
                  ? "Sign In to Review"
                  : !hasCompletedVisit
                    ? "Complete a Visit to Review"
                    : userAlreadyReviewed
                      ? "Edit Your Review"
                      : "Write a Review"}
              </Button>
            </div>

            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border p-3"
              >
                <p className="text-xs font-medium text-foreground">
                  How was your experience?
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  {Array.from({ length: 5 }, (_, idx) => {
                    const value = idx + 1;
                    return (
                      <button
                        key={value}
                        onClick={() => setReviewRating(value)}
                        className="rounded-md p-1.5 hover:bg-secondary transition-colors"
                      >
                        <Star
                          className={`h-5 w-5 ${value <= reviewRating ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                        />
                      </button>
                    );
                  })}
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Share details about food, service, and atmosphere"
                  className="mt-2 h-20 w-full resize-none rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-primary"
                />

                <Button
                  variant="cta"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0 || reviewComment.trim().length < 10}
                >
                  {existingUserReview ? "Update Review" : "Submit Review"}
                </Button>
              </motion.div>
            )}

            {restaurantReviews.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No reviews yet. Be the first to share your experience.
              </p>
            ) : (
              <div className="space-y-2.5">
                {restaurantReviews.slice(0, 4).map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-foreground">
                            {review.authorName}
                          </p>
                          {isVerifiedReview(review) && (
                            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                              Verified diner
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatReviewDate(review.updatedAt || review.createdAt)}
                          {review.updatedAt ? " (edited)" : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3.5 w-3.5 ${idx < review.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">
              Available slots for today
            </h3>
            {!hasAvailabilityToday && (
              <div className="mt-3 rounded-2xl border border-destructive/15 bg-destructive/5 p-3">
                <p className="text-sm font-semibold text-foreground">
                  Fully booked today
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  All tables are currently reserved. Check another date to book
                  this restaurant.
                </p>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {restaurant.availableSlots.map((slot) => {
                const unavailable = !bookableSlotsTodaySet.has(slot);

                return (
                  <button
                    key={slot}
                    disabled={unavailable}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                      unavailable
                        ? "border-border bg-muted text-muted-foreground cursor-not-allowed line-through"
                        : selectedSlot === slot
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-1 pb-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowMenu(!showMenu)}
            >
              Food Menu
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="flex-1"
              onClick={() => {
                if (isGuest && !isAuthenticated) {
                  navigate("/signin");
                  return;
                }
                navigate(`/book/${restaurant.id}`);
              }}
            >
              {hasAvailabilityToday ? "Book a Table" : "Check Another Date"}
            </Button>
          </div>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-2xl border border-border overflow-hidden mb-4"
            >
              <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Menu</h3>
              </div>
              <div className="divide-y divide-border">
                {restaurant.menu.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <RestaurantStoryViewer
        groups={storyGroups}
        initialRestaurantId={restaurant.id}
        open={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
        onRestaurantSeen={markRestaurantStorySeen}
        primaryActionLabel="Book Table"
        onPrimaryAction={(currentRestaurant) =>
          navigate(`/book/${currentRestaurant.id}`)
        }
      />
    </div>
  );
};

export default RestaurantDetailPage;
