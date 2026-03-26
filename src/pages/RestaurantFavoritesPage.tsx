import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const RestaurantFavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const { getRestaurantStats } = useReviews();
  const { restaurants } = useRestaurantData();

  const favoriteRestaurants = restaurants.filter((restaurant) =>
    favorites.includes(restaurant.id),
  );

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
          <h1 className="text-lg font-bold text-foreground">
            Favorite Restaurants
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {favoriteRestaurants.length} saved
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {favoriteRestaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center text-center"
          >
            <Heart className="h-14 w-14 text-muted-foreground/25" />
            <h2 className="mt-4 text-base font-semibold text-foreground">
              No favorites yet
            </h2>
            <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
              Save restaurants from Home or Search and they will appear here.
            </p>
            <Button
              variant="cta"
              size="lg"
              className="mt-6 w-full"
              onClick={() => navigate("/restaurant-dashboard")}
            >
              Back to Dashboard
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {favoriteRestaurants.map((restaurant, index) => {
              const stats = getRestaurantStats(restaurant);
              return (
                <motion.button
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="w-full overflow-hidden rounded-2xl border border-border text-left"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(restaurant.id);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-background/90 p-2"
                    >
                      <Heart className="h-4 w-4 fill-destructive text-destructive" />
                    </button>
                  </div>
                  <div className="space-y-1.5 p-3.5">
                    <p className="text-sm font-semibold text-foreground">
                      {restaurant.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {restaurant.distance}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantFavoritesPage;
