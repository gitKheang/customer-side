import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "ar", name: "Arabic", native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
  { code: "fr", name: "French", native: "Fran\u00E7ais" },
  { code: "es", name: "Spanish", native: "Espa\u00F1ol" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "zh", name: "Chinese", native: "\u4E2D\u6587" },
  { code: "ja", name: "Japanese", native: "\u65E5\u672C\u8A9E" },
  { code: "km", name: "Khmer", native: "\u1781\u17D2\u1798\u17C2\u179A" },
  { code: "ko", name: "Korean", native: "\uD55C\uAD6D\uC5B4" },
];

const RestaurantLanguagePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en");

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
        <h1 className="text-lg font-bold text-foreground">Language</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-border"
        >
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelected(lang.code)}
              className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/50 active:bg-secondary ${
                index < languages.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {lang.name}
                </p>
                <p className="text-xs text-muted-foreground">{lang.native}</p>
              </div>
              {selected === lang.code && (
                <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantLanguagePage;
