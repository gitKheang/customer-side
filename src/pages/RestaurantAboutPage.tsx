import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const RestaurantAboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-4">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/restaurant-settings")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">About</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-8"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <UtensilsCrossed className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">FoodReserve</h2>
          <p className="mt-1 text-xs text-muted-foreground">Version 1.0.0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-4"
        >
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground">Our Mission</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              FoodReserve connects diners with the best restaurants in their city. We make it easy to discover new places, book tables instantly, and enjoy seamless dining experiences.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground">For Restaurants</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Our restaurant dashboard helps you manage reservations, menus, tables, and customer engagement all in one place. Grow your business with powerful tools designed for the hospitality industry.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground">Built With</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground">
          Made with care in Phnom Penh, Cambodia
        </p>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantAboutPage;
