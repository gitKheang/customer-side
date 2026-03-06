import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import foodImage from "@/assets/food-avocado-toast.jpg";
import { Trophy, Flame, Footprints, Sparkles, Star } from "lucide-react";

const mealTabs = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const challenges = [
  { icon: "🥗", title: "Log all meals", points: 50, color: "bg-success/10" },
  { icon: "🚶", title: "Walk 5,000 steps", points: 75, color: "bg-primary/10" },
  { icon: "✨", title: "Complete AI quiz", points: 100, color: "bg-warning/10" },
];

const RewardsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/10">
              W
            </div>
            <div>
              <p className="text-base font-bold text-foreground">Hi, William 👋</p>
              <p className="text-[11px] text-muted-foreground">Keep earning rewards!</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2">
            <Trophy className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-bold text-foreground">1,320</span>
            <span className="text-[10px] text-muted-foreground">pts</span>
          </div>
        </div>

        {/* AI tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-sm font-medium text-background/90 italic max-w-[60%] leading-relaxed">
              "Today's tip: Add more fiber to your lunch."
            </p>
            <p className="mt-1.5 text-[11px] text-background/50 font-medium">Your AI Diet Coach</p>
            <button className="mt-3 rounded-xl bg-background/15 backdrop-blur-sm px-4 py-2 text-[11px] font-semibold text-background active:scale-95 transition-transform">
              Get Tips
            </button>
          </div>
          <img src={foodImage} alt="" className="absolute right-0 top-0 h-full w-32 object-cover opacity-25 rounded-r-3xl" />
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/20" />
        </motion.div>

        {/* Challenges */}
        <div className="px-5 mt-6">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Flame className="h-4 w-4 text-warning" /> Daily Challenges
          </h2>
          <div className="mt-3 space-y-2.5">
            {challenges.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3.5 rounded-2xl bg-secondary/50 p-4 border border-border/50"
              >
                <div className={`rounded-xl ${c.color} p-2.5`}>
                  <span className="text-xl">{c.icon}</span>
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{c.title}</span>
                <span className="text-sm font-bold text-primary">+{c.points} pts</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meal plan */}
        <div className="px-5 mt-6">
          <h2 className="text-base font-bold text-foreground">Today's Meal Plan</h2>
          <div className="mt-3 flex gap-2">
            {mealTabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all active:scale-95 ${
                  activeTab === i
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border border-border text-foreground hover:border-primary/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl overflow-hidden border border-border card-shadow"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={foodImage} alt="Avocado Toast" className="h-full w-full object-cover" />
            </div>
            <div className="p-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Avocado Toast</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>🔥 220 kcal</span>
                  <span className="text-border">•</span>
                  <span>⏱ 5 min</span>
                </p>
              </div>
              <button className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 active:scale-95 transition-transform">
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
