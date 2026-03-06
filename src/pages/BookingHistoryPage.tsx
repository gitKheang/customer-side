import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockBookings } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import { Clock, Users, CalendarDays, X } from "lucide-react";
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
    toast.success("Booking cancelled");
  };

  const statusColor = {
    upcoming: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />
      <div className="px-5 pb-3">
        <h1 className="text-xl font-bold text-foreground">Booking History</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-5 rounded-2xl bg-secondary/50 p-1">
        {(["upcoming", "completed", "cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-medium capitalize transition-all ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-sm">No {tab} bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  <img src={b.restaurantImage} alt={b.restaurantName} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-foreground text-sm">{b.restaurantName}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColor[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                      <p className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {b.date}</p>
                      <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.time}</p>
                      <p className="flex items-center gap-1"><Users className="h-3 w-3" /> {b.guests} Guests</p>
                    </div>
                  </div>
                </div>
                {b.status === "upcoming" && (
                  <div className="flex gap-2 border-t border-border p-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/book/${b.restaurantId}`)}>
                      Modify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
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
