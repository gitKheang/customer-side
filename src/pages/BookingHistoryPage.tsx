import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockBookings } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import { Clock, Users, CalendarDays, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [bookings, setBookings] = useState(mockBookings);

  const filtered = bookings.filter((b) => b.status === tab);

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
    toast.success("Booking cancelled successfully");
  };

  const statusColor = {
    upcoming: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />
      <div className="px-5 pb-4">
        <h1 className="text-lg font-bold text-foreground">Booking History</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">Manage your reservations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-5 rounded-2xl bg-secondary p-1 mb-4">
        {(["upcoming", "completed", "cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-medium capitalize transition-all ${
              tab === t ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-52 text-muted-foreground"
          >
            <CalendarDays className="h-14 w-14 mb-3 opacity-20" />
            <p className="text-sm font-medium">No {tab} bookings</p>
            <p className="text-xs mt-1 opacity-60">Your {tab} reservations will appear here</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border overflow-hidden card-shadow"
              >
                <div className="flex gap-3 p-3.5">
                  <img src={b.restaurantImage} alt={b.restaurantName} className="h-22 w-22 rounded-xl object-cover" style={{ width: 88, height: 88 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground text-sm truncate">{b.restaurantName}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize whitespace-nowrap ${statusColor[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
                      <p className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3 text-primary/60" /> {b.date}</p>
                      <p className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary/60" /> {b.time}</p>
                      <p className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary/60" /> {b.guests} Guests{b.tableNumber ? ` • Table ${b.tableNumber}` : ""}</p>
                    </div>
                  </div>
                </div>
                {b.status === "upcoming" && (
                  <div className="flex gap-2 border-t border-border px-3.5 py-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs rounded-xl" onClick={() => navigate(`/book/${b.restaurantId}`)}>
                      Modify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
                      onClick={() => cancelBooking(b.id)}
                    >
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default BookingHistoryPage;
