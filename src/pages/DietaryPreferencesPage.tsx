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
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-border" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <h1 className="mt-6 text-2xl font-bold text-foreground leading-tight">
          Select Your Dietary{"\n"}Preferences
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll personalize your meals based on what you eat.
        </p>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {dietaryOptions.map((opt, i) => {
            const isSelected = selected.includes(opt.id);
            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => toggle(opt.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border bg-background hover:border-primary/20"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-foreground">{opt.name}</span>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-primary" : "bg-secondary"
                  }`}>
                    {isSelected ? (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    ) : (
                      <Plus className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <button className="mt-4 flex w-full items-center justify-between rounded-2xl border border-dashed border-border p-4 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-foreground">Add custom dietary</span>
          <div className="rounded-full bg-secondary p-1.5">
            <Plus className="h-4 w-4 text-foreground" />
          </div>
        </button>

        <div className="mt-auto mb-10 flex items-center gap-3">
          <Button variant="cta" size="lg" className="flex-1" onClick={() => navigate("/challenges")}>
            Continue
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/challenges")} className="text-muted-foreground">
            Skip for Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DietaryPreferencesPage;
