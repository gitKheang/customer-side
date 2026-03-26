import { useNavigate } from "react-router-dom";
import { ArrowLeft, BellOff, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import { useBookings } from "@/contexts/BookingsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";

const typeIcon: Record<string, string> = {
  booking_confirmed: "✅",
  booking_cancelled: "❌",
  booking_modified: "✏️",
  reminder: "🔔",
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const RestaurantNotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markNotificationsRead,
  } = useBookings();
  const { managedRestaurant } = useRestaurantData();
  const restaurantNotifications = notifications.filter(
    (notification) =>
      notification.audience === "restaurant" &&
      notification.restaurantId === managedRestaurant.id,
  );
  const unreadCount = restaurantNotifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goBackOr(navigate, "/restaurant-dashboard")}
            className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Notifications</h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-primary"
            onClick={() =>
              markNotificationsRead(
                restaurantNotifications
                  .filter((notification) => !notification.read)
                  .map((notification) => notification.id),
              )
            }
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {restaurantNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-52 flex-col items-center justify-center text-muted-foreground"
          >
            <BellOff className="mb-3 h-14 w-14 opacity-20" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="mt-1 text-xs opacity-60">
              Booking updates will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {restaurantNotifications.map((notif, i) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markNotificationRead(notif.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  notif.read
                    ? "border-border bg-background"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">
                    {typeIcon[notif.type] || "🔔"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {notif.message}
                    </p>
                    <p className="mt-2 text-[10px] text-muted-foreground/60">
                      {formatTime(notif.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantNotificationsPage;
