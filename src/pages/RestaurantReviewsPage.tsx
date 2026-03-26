import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import { useReviews } from "@/contexts/ReviewsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";

const RestaurantReviewsPage = () => {
  const navigate = useNavigate();
  const { managedRestaurant } = useRestaurantData();
  const { getReviewsForRestaurant, getRestaurantStats } = useReviews();

  const restaurantReviews = [...getReviewsForRestaurant(managedRestaurant.id)].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime(),
  );
  const ratingStats = getRestaurantStats(managedRestaurant);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-4">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/restaurant-profile")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Reviews</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            What customers are saying
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-4 rounded-2xl border border-border p-4"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">
              {ratingStats.averageRating.toFixed(1)}
            </p>
            <div className="mt-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(ratingStats.averageRating)
                      ? "fill-warning text-warning"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {restaurantReviews.length} reviews
            </p>
            <p className="text-[11px] text-muted-foreground">
              Overall rating
            </p>
          </div>
        </motion.div>

        {/* Review list */}
        {restaurantReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-40 flex-col items-center justify-center text-muted-foreground"
          >
            <MessageSquare className="mb-3 h-14 w-14 opacity-20" />
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="mt-1 text-xs opacity-60">
              Customer reviews will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {restaurantReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="rounded-2xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {review.authorName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatDate(review.updatedAt || review.createdAt)}
                  </p>
                </div>
                <div className="mt-1.5 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        s <= review.rating
                          ? "fill-warning text-warning"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantReviewsPage;
