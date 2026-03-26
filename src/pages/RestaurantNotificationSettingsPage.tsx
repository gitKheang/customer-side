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
    key: "reservations",
    label: "New Reservation Alerts",
    description: "Get notified when customers book or cancel",
    enabled: true,
  },
  {
    key: "reminders",
    label: "Booking Reminders",
    description: "Reminders before upcoming reservations",
    enabled: true,
  },
  {
    key: "reviews",
    label: "Customer Review Alerts",
    description: "Get notified when customers leave reviews",
    enabled: false,
  },
  {
    key: "profile",
    label: "Profile Updates",
    description: "Notifications about profile and menu changes",
    enabled: true,
  },
  {
    key: "news",
    label: "Platform News & Updates",
    description: "App updates and new features for owners",
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
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                  item.enabled ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    item.enabled ? "translate-x-[26px]" : "translate-x-[3px]"
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
