import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Camera,
  ChevronRight,
  CircleHelp,
  LogOut,
  Settings,
  Shield,
  Star,
  Store,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const menuItems = [
  { label: "Notifications", icon: Bell, to: "/restaurant-notifications" },
  { label: "Reviews", icon: Star, to: "/restaurant-reviews" },
  { label: "Privacy & Security", icon: Shield, to: "/restaurant-privacy" },
  { label: "Help & Support", icon: CircleHelp, to: "/restaurant-help" },
  { label: "Settings", icon: Settings, to: "/restaurant-settings" },
];

const RestaurantProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { managedRestaurant } = useRestaurantData();

  const displayName = user?.name || "Phorn Sinet";
  const displayEmail = user?.email || "sinet@gmail.com";
  const displayPhone = user?.phone || "+855 12 888 001";

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Manage your owner account
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center px-5 py-5"
        >
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/25 to-primary/5 text-3xl font-bold text-primary ring-4 ring-primary/10">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName[0]?.toUpperCase() || "U"
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate("/restaurant-edit-profile")}
              className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2.5 shadow-lg shadow-primary/30 transition-transform active:scale-90"
            >
              <Camera className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>

          <p className="mt-3 text-lg font-bold text-foreground">
            {displayName}
          </p>
          <p className="text-xs text-muted-foreground">{displayEmail}</p>
          <p className="text-xs text-muted-foreground">{displayPhone}</p>
        </motion.div>

        <div className="space-y-4 px-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-secondary p-2.5">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Restaurant access
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {managedRestaurant.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Manage business settings, reservation updates, reviews, and
                  restaurant profile details from one place.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/restaurant-edit-listing")}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Edit public listing
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/restaurant-stories")}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Manage stories
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="overflow-hidden rounded-2xl border border-border"
          >
            {menuItems.map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.to)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-sm text-foreground transition-colors hover:bg-secondary/50 active:bg-secondary ${
                  i < menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="rounded-lg bg-secondary p-2">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 text-left text-sm font-medium">
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            type="button"
            onClick={() => navigate("/restaurant-edit-profile")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/50 active:bg-secondary"
          >
            <User className="h-4 w-4" />
            Edit owner profile
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/15 py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 active:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </motion.button>
        </div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantProfilePage;
