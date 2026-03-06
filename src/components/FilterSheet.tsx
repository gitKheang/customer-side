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

  const toggleArray = (arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) =>
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
            className="absolute inset-0 bg-foreground/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-background max-h-[85%] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Filter</h2>
                <button onClick={onClose} className="rounded-full border border-border p-2">
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">⚡ Quick Filters</h3>
                <div className="flex gap-2 flex-wrap">
                  {quickOpts.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => toggleArray(quickFilters, q.label, setQuickFilters)}
                      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                        quickFilters.includes(q.label)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground"
                      }`}
                    >
                      <q.icon className="h-3.5 w-3.5" />
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">📍 Distance</h3>
                  <span className="text-sm font-bold text-primary">{distance[0]} miles</span>
                </div>
                <Slider value={distance} onValueChange={setDistance} min={1} max={25} step={1} className="w-full" />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>1mi</span>
                  <span>25mi</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">⭐ Minimum Rating</h3>
                <div className="flex gap-2">
                  {ratings.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all ${
                        rating === r
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">🍳 Cuisine Type</h3>
                <div className="flex gap-2 flex-wrap">
                  {cuisineTypes.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleArray(selectedCuisines, c, setSelectedCuisines)}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                        selectedCuisines.includes(c)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">🥬 Dietary Options</h3>
                <div className="flex gap-2 flex-wrap">
                  {dietaryOpts.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleArray(selectedDietary, d, setSelectedDietary)}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                        selectedDietary.includes(d)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-4">
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
