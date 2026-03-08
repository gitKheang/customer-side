import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Restaurant, type Review, mockReviews } from "@/data/mockData";

interface RestaurantRatingStats {
  averageRating: number;
  reviewCount: number;
}

interface SubmitReviewInput {
  restaurantId: string;
  rating: number;
  comment: string;
  authorName: string;
  authorEmail: string;
}

interface ReviewsContextType {
  reviews: Review[];
  getReviewsForRestaurant: (restaurantId: string) => Review[];
  getRestaurantStats: (
    restaurant: Pick<Restaurant, "id" | "rating" | "reviewCount">,
  ) => RestaurantRatingStats;
  submitReview: (
    input: SubmitReviewInput,
  ) => { success: boolean; message: string };
  hasUserReviewed: (restaurantId: string, authorEmail: string) => boolean;
}

const ReviewsContext = createContext<ReviewsContextType | null>(null);

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) {
    throw new Error("useReviews must be used within ReviewsProvider");
  }
  return ctx;
};

const REVIEWS_KEY = "rra_reviews";

function getStoredReviews(): Review[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "null");
    if (!parsed || !Array.isArray(parsed)) {
      return mockReviews;
    }
    return parsed;
  } catch {
    return mockReviews;
  }
}

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews);

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const reviewsByRestaurant = useMemo(() => {
    const grouped: Record<string, Review[]> = {};
    for (const review of reviews) {
      if (!grouped[review.restaurantId]) {
        grouped[review.restaurantId] = [];
      }
      grouped[review.restaurantId].push(review);
    }

    for (const restaurantId of Object.keys(grouped)) {
      grouped[restaurantId].sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime(),
      );
    }

    return grouped;
  }, [reviews]);

  const ratingAggregates = useMemo(() => {
    const grouped: Record<string, { count: number; sum: number }> = {};

    for (const review of reviews) {
      const current = grouped[review.restaurantId] || { count: 0, sum: 0 };
      grouped[review.restaurantId] = {
        count: current.count + 1,
        sum: current.sum + review.rating,
      };
    }

    return grouped;
  }, [reviews]);

  const getReviewsForRestaurant = (restaurantId: string) => {
    return reviewsByRestaurant[restaurantId] || [];
  };

  const getRestaurantStats = (
    restaurant: Pick<Restaurant, "id" | "rating" | "reviewCount">,
  ) => {
    const aggregate = ratingAggregates[restaurant.id] || { count: 0, sum: 0 };

    // Cap the prior influence so new mock reviews still move the visible score.
    const priorWeight = Math.min(restaurant.reviewCount, 50);
    const weightedCount = priorWeight + aggregate.count;
    const weightedRating =
      (restaurant.rating * priorWeight + aggregate.sum) /
      Math.max(weightedCount, 1);

    return {
      averageRating: Number(weightedRating.toFixed(1)),
      reviewCount: restaurant.reviewCount + aggregate.count,
    };
  };

  const submitReview = ({
    restaurantId,
    rating,
    comment,
    authorName,
    authorEmail,
  }: SubmitReviewInput) => {
    const normalizedEmail = authorEmail.trim().toLowerCase();
    const normalizedName = authorName.trim();
    const cleanComment = comment.trim();

    if (!restaurantId || !normalizedEmail) {
      return { success: false, message: "Unable to identify this review" };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, message: "Please select a rating from 1 to 5" };
    }

    if (cleanComment.length < 10) {
      return {
        success: false,
        message: "Please write at least 10 characters for your review",
      };
    }

    const existingReview = reviews.find(
      (review) =>
        review.restaurantId === restaurantId &&
        review.authorEmail.toLowerCase() === normalizedEmail,
    );

    if (existingReview) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === existingReview.id
            ? {
                ...review,
                rating,
                comment: cleanComment,
                updatedAt: new Date().toISOString(),
                authorName: normalizedName || review.authorName,
              }
            : review,
        ),
      );

      return { success: true, message: "Your review has been updated" };
    }

    const newReview: Review = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      restaurantId,
      rating,
      comment: cleanComment,
      authorName: normalizedName || normalizedEmail.split("@")[0],
      authorEmail: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    return { success: true, message: "Thank you for your review" };
  };

  const hasUserReviewed = (restaurantId: string, authorEmail: string) => {
    const normalizedEmail = authorEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      return false;
    }

    return reviews.some(
      (review) =>
        review.restaurantId === restaurantId &&
        review.authorEmail.toLowerCase() === normalizedEmail,
    );
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        getReviewsForRestaurant,
        getRestaurantStats,
        submitReview,
        hasUserReviewed,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};
