import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCheck, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  read: boolean;
}

const typeIcon: Record<string, string> = {
  order: "📦",
  reservation: "📅",
  promo: "🏷️",
  streak: "🔥",
  ready: "✅",
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Order Confirmed",
    description:
      "Your order from Malis Restaurant is being prepared. ETA: 25 min.",
    date: "Feb 18",
    type: "order",
    read: false,
  },
  {
    id: "2",
    title: "Reservation Reminder",
    description:
      "Your reservation at Malis Restaurant is tonight at 7:00 PM. Don't forget!",
    date: "Feb 17",
    type: "reservation",
    read: false,
  },
  {
    id: "3",
    title: "Khmer New Year Sale!",
    description:
      "Use code KNY2026 for 20% off all Khmer dishes. Celebrate with us!",
    date: "Feb 16",
    type: "promo",
    read: true,
  },
  {
    id: "4",
    title: "Streak Alert",
    description:
      "You're on a 5-day streak! Order today to keep it going and unlock 15% off.",
    date: "Feb 15",
    type: "streak",
    read: true,
  },
  {
    id: "5",
    title: "Order Ready!",
    description: "Your order from Romdeng is almost ready for pickup.",
    date: "Feb 14",
    type: "ready",
    read: true,
  },
];

const RestaurantNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      {/* Header – matches customer NotificationsPage */}
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
            onClick={markAllRead}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-52 flex-col items-center justify-center text-muted-foreground"
          >
            <BellOff className="mb-3 h-14 w-14 opacity-20" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="mt-1 text-xs opacity-60">
              Your notifications will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, i) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(notif.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  notif.read
                    ? "border-border bg-background"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">
                    {typeIcon[notif.type] || "📋"}
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
                      {notif.description}
                    </p>
                    <p className="mt-2 text-[10px] text-muted-foreground/60">
                      {notif.date}
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
