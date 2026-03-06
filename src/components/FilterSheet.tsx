import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Clock, Heart, TrendingUp } from "lucide-react";
import { cuisineTypes } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
}

const FilterSheet = ({ open, onClose }: FilterSheetProps) => {
  const [distance, setDistance] = useState([5]);
  const [rating, setRating] = useState("Any");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  const ratings = ["Any", "4.5+", "4+", "3.5+", "3+"];
  const dietaryOpts = ["Vegetarian", "Vegan", "Gluten-Free"];
  const quickOpts = [
    { label: "Open Now", icon: Clock },
    { label: "Favorites", icon: Heart },
    { label: "Trending", icon: TrendingUp },
  ];

  const toggleArray = (val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((p) => (p.includes(val) ? p.filter((v) => v !== val) : [...p, val]));

  const clearAll = () => {
    setDistance([5]);
    setRating("Any");
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setQuickFilters([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-background max-h-[85%] overflow-y-auto scrollbar-hide"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="px-6 pb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">Filter</h2>
                <button onClick={onClose} className="rounded-full border border-border p-2 hover:bg-secondary transition-colors active:scale-90">
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">⚡ Quick Filters</h3>
                <div className="flex gap-2 flex-wrap">
                  {quickOpts.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => toggleArray(q.label, setQuickFilters)}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-medium transition-all active:scale-95 ${
                        quickFilters.includes(q.label)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary/20"
                      }`}
                    >
                      <q.icon className="h-3.5 w-3.5" />
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">📍 Distance</h3>
                  <span className="text-xs font-bold text-primary">{distance[0]} miles</span>
                </div>
                <Slider value={distance} onValueChange={setDistance} min={1} max={25} step={1} className="w-full" />
                <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                  <span>1mi</span>
                  <span>25mi</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">⭐ Minimum Rating</h3>
                <div className="flex gap-2">
                  {ratings.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`flex-1 rounded-xl border py-2.5 text-[11px] font-medium transition-all active:scale-95 ${
                        rating === r
                          ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "border-border text-foreground hover:border-primary/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">🍳 Cuisine Type</h3>
                <div className="flex gap-2 flex-wrap">
                  {cuisineTypes.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleArray(c, setSelectedCuisines)}
                      className={`rounded-xl border px-4 py-2.5 text-[11px] font-medium transition-all active:scale-95 ${
                        selectedCuisines.includes(c)
                          ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "border-border text-foreground hover:border-primary/20"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">🥬 Dietary Options</h3>
                <div className="flex gap-2 flex-wrap">
                  {dietaryOpts.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleArray(d, setSelectedDietary)}
                      className={`rounded-xl border px-4 py-2.5 text-[11px] font-medium transition-all active:scale-95 ${
                        selectedDietary.includes(d)
                          ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "border-border text-foreground hover:border-primary/20"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={clearAll}>
                  Clear all
                </Button>
                <Button variant="cta" size="lg" className="flex-1" onClick={onClose}>
                  Show Results
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSheet;
