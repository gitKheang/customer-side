import { useNavigate } from "react-router-dom";
import { useBookings } from "@/contexts/BookingsContext";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, BellOff, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { goBackOr } from "@/lib/navigation";
import { getPreferredIdentifier } from "@/lib/authValidation";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markNotificationsRead,
  } = useBookings();
  const { user, isAuthenticated, isGuest } = useAuth();
  const currentUserIdentifier = getPreferredIdentifier(user?.email, user?.phone);
  const customerNotifications = notifications.filter(
    (notification) =>
      notification.audience === "customer" &&
      currentUserIdentifier.length > 0 &&
      (notification.recipientIdentifier ||
        notification.recipientEmail?.toLowerCase()) === currentUserIdentifier,
  );
  const unreadCount = customerNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const typeIcon = {
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

  if (isGuest && !isAuthenticated) {
    return (
      <div className="relative flex h-full flex-col bg-background">
        <div className="safe-area-top" />
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <BellOff className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-lg font-bold text-foreground">
            Sign in to view notifications
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create an account or sign in to receive booking confirmations and
            reservation updates.
          </p>
          <Button
            variant="cta"
            size="lg"
            className="w-full mt-6"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full mt-3"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => goBackOr(navigate, "/home")}
            className="rounded-full p-2 hover:bg-secondary transition-colors active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Notifications</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary gap-1"
            onClick={() =>
              markNotificationsRead(
                customerNotifications
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
        {customerNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-52 text-muted-foreground"
          >
            <BellOff className="h-14 w-14 mb-3 opacity-20" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs mt-1 opacity-60">
              Your notifications will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {customerNotifications.map((n, i) => (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markNotificationRead(n.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                  n.read
                    ? "border-border bg-background"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{typeIcon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">
                      {formatTime(n.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default NotificationsPage;
