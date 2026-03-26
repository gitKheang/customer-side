import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const RestaurantFavoritesPage = () => {
  const navigate = useNavigate();

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
        <h1 className="text-lg font-bold text-foreground">Favorites</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Empty state – matches customer empty states */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center pt-32"
        >
          <Heart className="mb-4 h-16 w-16 text-muted-foreground/20" />
          <h2 className="text-lg font-bold text-foreground">
            No favorites yet
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Heart restaurants you love to save them here
          </p>
          <Button
            variant="cta"
            size="lg"
            className="mt-6 w-full"
            onClick={() => navigate("/restaurant-dashboard")}
          >
            Browse Restaurants
          </Button>
        </motion.div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantFavoritesPage;
