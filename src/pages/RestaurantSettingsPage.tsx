import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Store,
  MapPin,
  Bell,
  Camera,
  Globe,
  Shield,
  CircleHelp,
  Info,
  ChevronRight,
} from "lucide-react";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const settingsItems = [
  { label: "Edit Profile", icon: User, to: "/restaurant-edit-profile" },
  { label: "Restaurant Listing", icon: Store, to: "/restaurant-edit-listing" },
  { label: "Stories", icon: Camera, to: "/restaurant-stories" },
  { label: "Business Addresses", icon: MapPin, to: "/restaurant-addresses" },
  { label: "Notifications", icon: Bell, to: "/restaurant-notification-settings" },
  { label: "Language", icon: Globe, to: "/restaurant-language" },
  { label: "Privacy & Security", icon: Shield, to: "/restaurant-privacy" },
  { label: "Help & Support", icon: CircleHelp, to: "/restaurant-help" },
  { label: "About", icon: Info, to: "/restaurant-about" },
];

const RestaurantSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-4">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/restaurant-profile")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Customize your experience
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-border"
        >
          {settingsItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.to)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-sm text-foreground transition-colors hover:bg-secondary/50 active:bg-secondary ${
                index < settingsItems.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              <div className="rounded-lg bg-secondary p-2">
                <item.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </div>
              <span className="flex-1 text-left text-sm font-medium">
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          FoodReserve v1.0.0
        </p>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantSettingsPage;
