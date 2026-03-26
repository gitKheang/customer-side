import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

interface ToggleItem {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialToggles: ToggleItem[] = [
  {
    key: "orders",
    label: "Order Updates",
    description: "Get notified about order status changes",
    enabled: true,
  },
  {
    key: "reservations",
    label: "Reservation Reminders",
    description: "Reminders before your reservation",
    enabled: true,
  },
  {
    key: "promotions",
    label: "Promotions & Offers",
    description: "Special deals and discount codes",
    enabled: false,
  },
  {
    key: "reviews",
    label: "Review Requests",
    description: "Reminders to rate your experience",
    enabled: true,
  },
  {
    key: "news",
    label: "News & Updates",
    description: "App updates and new features",
    enabled: false,
  },
];

const RestaurantNotificationSettingsPage = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState<ToggleItem[]>(initialToggles);

  const handleToggle = (key: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.key === key ? { ...t, enabled: !t.enabled } : t))
    );
  };

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
        <div>
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Choose what to be notified about
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-border"
        >
          {toggles.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-4 py-4 ${
                index < toggles.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="min-w-0 flex-1 pr-3">
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  item.enabled ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    item.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </motion.div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantNotificationSettingsPage;
