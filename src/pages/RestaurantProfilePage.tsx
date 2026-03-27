import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Camera,
  ChevronRight,
  CircleHelp,
  Image as ImageIcon,
  LogOut,
  Pencil,
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

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-2 overflow-hidden rounded-3xl"
          style={{
            background:
              "linear-gradient(145deg, hsl(47 70% 92%) 0%, hsl(47 60% 85%) 100%)",
            border: "1.5px solid hsl(47 65% 78%)",
          }}
        >
          <div className="flex items-center gap-4 p-5">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white/70 text-2xl font-bold text-primary ring-[3px] ring-white/80">
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
                className="absolute -bottom-0.5 -right-0.5 rounded-full p-1.5 shadow-sm transition-transform active:scale-90"
                style={{ background: "hsl(47 80% 53%)" }}
              >
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-foreground">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
              <div
                className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{
                  background: "hsl(47 75% 85%)",
                  border: "1px solid hsl(47 65% 72%)",
                }}
              >
                <Store className="h-3 w-3" style={{ color: "hsl(47 80% 38%)" }} />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: "hsl(47 80% 32%)" }}
                >
                  {managedRestaurant.name}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick actions (side-by-side) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 grid grid-cols-2 gap-3 px-5"
        >
          <button
            type="button"
            onClick={() => navigate("/restaurant-edit-listing")}
            className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center transition-all active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(160deg, hsl(47 70% 94%) 0%, hsl(47 55% 88%) 100%)",
              border: "1.5px solid hsl(47 60% 78%)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: "hsl(47 75% 82%)",
                border: "1px solid hsl(47 60% 72%)",
              }}
            >
              <Pencil className="h-[18px] w-[18px]" style={{ color: "hsl(47 85% 35%)" }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">
                Edit listing
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                Name, photos & slots
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/restaurant-stories")}
            className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center transition-all active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(160deg, hsl(47 70% 94%) 0%, hsl(47 55% 88%) 100%)",
              border: "1.5px solid hsl(47 60% 78%)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: "hsl(47 75% 82%)",
                border: "1px solid hsl(47 60% 72%)",
              }}
            >
              <ImageIcon className="h-[18px] w-[18px]" style={{ color: "hsl(47 85% 35%)" }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">
                Manage stories
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                Add or remove stories
              </p>
            </div>
          </button>
        </motion.div>

        {/* ── Menu list ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-4 px-5"
        >
          <div className="overflow-hidden rounded-2xl border border-border">
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
          </div>
        </motion.div>

        {/* ── Log out ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 px-5"
        >
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/15 py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 active:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </motion.div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantProfilePage;
