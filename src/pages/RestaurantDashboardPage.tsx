import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  DollarSign,
  Package,
  CalendarDays,
  Star,
  TrendingUp,
  UtensilsCrossed,
  CalendarCheck2,
  Store,
  Settings,
} from "lucide-react";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import { useBookings } from "@/contexts/BookingsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { useReviews } from "@/contexts/ReviewsContext";
const weekData = [
  { day: "Mon", value: 60 },
  { day: "Tue", value: 75 },
  { day: "Wed", value: 85, current: true },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 80 },
  { day: "Sun", value: 65 },
];

const RestaurantDashboardPage = () => {
  const navigate = useNavigate();
  const { bookings, notifications } = useBookings();
  const { managedRestaurant } = useRestaurantData();
  const { getRestaurantStats } = useReviews();
  const ratingStats = getRestaurantStats(managedRestaurant);
  const [stats] = useState({
    revenue: 59.0,
  });
  const ownerNotifications = notifications.filter(
    (notification) =>
      notification.audience === "restaurant" &&
      notification.restaurantId === managedRestaurant.id,
  );
  const unreadCount = ownerNotifications.filter(
    (notification) => !notification.read,
  ).length;
  const ownerBookings = bookings.filter(
    (booking) => booking.restaurantId === managedRestaurant.id,
  );
  const pendingBookings = ownerBookings.filter(
    (booking) => booking.status === "upcoming",
  ).length;
  const availableMenuItems = managedRestaurant.menu.filter(
    (item) => item.status !== "sold_out",
  ).length;

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <main className="relative flex-1 min-h-0 overflow-y-auto pb-28 scrollbar-hide">
        {/* Gold hero – mirrors the customer HomePage gradient header */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="safe-area-top relative overflow-hidden bg-[linear-gradient(135deg,#f5cf34_0%,#efc419_58%,#e5b90e_100%)] px-5 pb-5 pt-2"
        >
          <div className="pointer-events-none absolute -right-8 top-6 h-28 w-28 rounded-full bg-white/14 blur-2xl" />
          <div className="pointer-events-none absolute left-16 top-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="rounded-full border border-white/25 bg-white/16 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d4d1f] backdrop-blur-sm">
                Restaurant Dashboard
              </div>
              <button
                type="button"
                onClick={() => navigate("/restaurant-notifications")}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/18 text-[#2f2414] backdrop-blur-sm transition-transform active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2.2} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="mt-4">
              <h1 className="max-w-[260px] text-[26px] font-bold leading-tight text-[#2f2414]">
                {managedRestaurant.name}
              </h1>
              <p className="mt-1.5 text-[14px] leading-6 text-[#5f522f]">
                {managedRestaurant.address}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Content area – matches the rounded card area from customer HomePage */}
        <div className="flex-1 overflow-hidden rounded-t-[26px] bg-background">
          <div className="px-5 pb-6 pt-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Today's Revenue",
                  value: `$${stats.revenue.toFixed(2)}`,
                  Icon: DollarSign,
                  iconBg: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                },
                {
                  label: "Available Dishes",
                  value: availableMenuItems,
                  Icon: Package,
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                },
                {
                  label: "Pending Bookings",
                  value: pendingBookings,
                  Icon: CalendarDays,
                  iconBg: "bg-orange-50",
                  iconColor: "text-orange-600",
                },
                {
                  label: "Rating",
                  value: ratingStats.averageRating.toFixed(1),
                  Icon: Star,
                  iconBg: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="rounded-2xl border border-border p-3.5"
                >
                  <div className={`inline-flex rounded-lg p-2 ${card.iconBg}`}>
                    <card.Icon className={`h-4 w-4 ${card.iconColor}`} strokeWidth={2.2} />
                  </div>
                  <p className="mt-2.5 text-[20px] font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {card.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Weekly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-5 rounded-2xl border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Weekly Overview
                </h2>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-4 flex items-end justify-between gap-2">
                {weekData.map((d) => (
                  <div
                    key={d.day}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex h-[100px] w-full items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          d.current ? "bg-primary" : "bg-primary/20"
                        }`}
                        style={{ height: `${d.value}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] ${
                        d.current
                          ? "font-bold text-primary"
                          : "font-medium text-muted-foreground"
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="mt-5">
              <h2 className="text-base font-bold text-foreground">
                Quick Actions
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { label: "Manage Menu", Icon: UtensilsCrossed, to: "/restaurant-menu" },
                  { label: "Reservation", Icon: CalendarCheck2, to: "/restaurant-bookings" },
                  { label: "Public Listing", Icon: Store, to: "/restaurant-edit-listing" },
                  { label: "Settings", Icon: Settings, to: "/restaurant-settings" },
                ].map(({ label, Icon, to }, i) => (
                  <motion.button
                    key={label}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    onClick={() => navigate(to)}
                    className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
                  >
                    <div className="rounded-lg bg-secondary p-2">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantDashboardPage;
