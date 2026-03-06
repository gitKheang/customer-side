import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import foodImage from "@/assets/food-avocado-toast.jpg";

const tabs = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const RewardsPage = () => {
  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm font-bold text-primary">W</div>
            <p className="text-base font-semibold text-foreground">Hi, William 👋</p>
          </div>
          <div className="rounded-xl border border-border px-3 py-1.5">
            <span className="text-xs font-bold text-foreground">1320 Point</span>
          </div>
        </div>

        {/* AI tip */}
        <div className="mx-5 rounded-2xl bg-gradient-to-r from-foreground to-foreground/80 p-5 relative overflow-hidden">
          <p className="text-sm font-medium text-background/90 italic max-w-[60%]">
            "Today's tip: Add more fiber to your lunch."
          </p>
          <p className="mt-1 text-xs text-background/60">Your AI Diet Coach</p>
          <button className="mt-2 rounded-lg bg-background/20 px-3 py-1.5 text-[10px] font-semibold text-background backdrop-blur-sm">
            Get Tips
          </button>
          <img src={foodImage} alt="" className="absolute right-0 top-0 h-full w-28 object-cover opacity-30 rounded-r-2xl" />
        </div>

        {/* Meal plan */}
        <div className="px-5 mt-6">
          <h2 className="text-lg font-bold text-foreground">Today's Meal Plan</h2>
          <div className="mt-3 flex gap-2">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  i === 0 ? "bg-primary text-primary-foreground" : "border border-border text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl overflow-hidden border border-border"
          >
            <img src={foodImage} alt="Avocado Toast" className="h-48 w-full object-cover" />
            <div className="p-4 flex items-end justify-between">
              <div>
                <p className="font-bold text-foreground">Avocado Toast</p>
                <p className="text-xs text-muted-foreground mt-0.5">🔥 220 kcal · ⏱ 5 min</p>
              </div>
              <button className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                View Recipe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RewardsPage;
