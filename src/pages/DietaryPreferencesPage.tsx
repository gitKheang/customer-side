import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { dietaryOptions } from "@/data/mockData";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

const DietaryPreferencesPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  return (
    <div className="flex h-full flex-col bg-background safe-area-top px-6">
      <div className="mt-4 mb-2 flex gap-2">
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-border" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <h1 className="mt-6 text-3xl font-bold text-foreground leading-tight">
          Select Your Dietary{"\n"}Preferences
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll personalize your meals based on what you eat.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {dietaryOptions.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(opt.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-foreground">{opt.name}</span>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <button className="mt-4 flex w-full items-center justify-between rounded-2xl border border-border p-4">
          <span className="text-sm text-foreground">Add custom dietary</span>
          <Plus className="h-5 w-5 text-foreground" />
        </button>

        <div className="mt-auto mb-8 flex items-center gap-4">
          <Button variant="cta" size="lg" className="flex-1" onClick={() => navigate("/challenges")}>
            Continue
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/challenges")}>
            Skip for Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DietaryPreferencesPage;
