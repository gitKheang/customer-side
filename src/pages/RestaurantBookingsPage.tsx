import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

type BookingStatus = "pending" | "confirmed" | "completed";

interface Booking {
  id: string;
  orderId: string;
  status: BookingStatus;
  date: string;
  time: string;
  guests: number;
  table: number;
  checkedIn?: boolean;
}

const initialBookings: Booking[] = [
  {
    id: "1",
    orderId: "#OR1",
    status: "confirmed",
    date: "2026-02-18",
    time: "19:00",
    guests: 2,
    table: 11,
  },
  {
    id: "2",
    orderId: "#OR2",
    status: "pending",
    date: "2026-02-19",
    time: "12:00",
    guests: 6,
    table: 13,
  },
  {
    id: "3",
    orderId: "#OR3",
    status: "pending",
    date: "2026-02-19",
    time: "12:00",
    guests: 6,
    table: 13,
  },
  {
    id: "4",
    orderId: "#OR4",
    status: "completed",
    date: "2026-02-14",
    time: "19:00",
    guests: 2,
    table: 14,
    checkedIn: true,
  },
];

const tabs: { label: string; value: BookingStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
];

const statusColor: Record<BookingStatus, string> = {
  pending: "bg-primary/10 text-primary",
  confirmed: "bg-success/10 text-success",
  completed: "bg-secondary text-muted-foreground",
};

const RestaurantBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<BookingStatus>("pending");

  const filtered = bookings.filter((b) => b.status === activeTab);
  const countFor = (s: BookingStatus) =>
    bookings.filter((b) => b.status === s).length;

  const handleConfirm = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b))
    );
  };

  const handleDecline = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleComplete = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "completed", checkedIn: true } : b
      )
    );
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-foreground">Reservations</h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Manage your reservations
        </p>
      </div>

      {/* Tabs – matches customer BookingHistoryPage style */}
      <div className="mx-5 mb-4 flex gap-1 rounded-2xl bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-medium capitalize transition-all ${
              activeTab === tab.value
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {tab.label} ({countFor(tab.value)})
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Booking cards */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-52 flex-col items-center justify-center text-muted-foreground"
          >
            <Clock className="mb-3 h-14 w-14 opacity-20" />
            <p className="text-sm font-medium">No {activeTab} reservations</p>
            <p className="mt-1 text-xs opacity-60">
              Your {activeTab} reservations will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border overflow-hidden card-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {booking.orderId}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusColor[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    {booking.checkedIn && (
                      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success">
                        Checked In
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-primary/60" />
                      <div>
                        <span className="font-medium text-foreground">
                          {booking.date}
                        </span>
                        <br />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-primary/60" />
                      <div>
                        <span className="font-medium text-foreground">
                          {booking.guests} guests
                        </span>
                        <br />
                        <span>Table {booking.table}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === "pending" && (
                  <div className="flex gap-2 border-t border-border px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs text-destructive border-destructive/20 hover:bg-destructive/5"
                      onClick={() => handleDecline(booking.id)}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Decline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs"
                      onClick={() => handleConfirm(booking.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Confirm
                    </Button>
                  </div>
                )}
                {booking.status === "confirmed" && (
                  <div className="border-t border-border px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 py-0 text-xs font-semibold text-success hover:bg-transparent hover:text-success"
                      onClick={() => handleComplete(booking.id)}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantBookingsPage;
