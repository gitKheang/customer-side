import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Check, X, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import { useBookings } from "@/contexts/BookingsContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";

type ViewTab = "upcoming" | "completed" | "cancelled";

const tabs: { label: string; value: ViewTab }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const statusColor: Record<ViewTab, string> = {
  upcoming: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const convertTo24h = (time12h: string) => {
  const match = time12h.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return "00:00";
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

const getBookingDateTime = (date: string, time: string) =>
  new Date(`${date}T${convertTo24h(time)}:00`);

const RestaurantBookingsPage = () => {
  const { bookings, cancelBooking, completeBooking } = useBookings();
  const { managedRestaurant } = useRestaurantData();
  const [activeTab, setActiveTab] = useState<ViewTab>("upcoming");
  const restaurantBookings = bookings.filter(
    (booking) => booking.restaurantId === managedRestaurant.id,
  );

  const getDisplayStatus = (
    booking: (typeof bookings)[number],
  ): ViewTab => {
    if (booking.status === "cancelled") return "cancelled";
    if (booking.status === "completed") return "completed";

    const bookingDateTime = getBookingDateTime(booking.date, booking.time);
    const now = new Date();
    if (!Number.isNaN(bookingDateTime.getTime()) && bookingDateTime < now) {
      return "completed";
    }
    return "upcoming";
  };

  const filtered = restaurantBookings.filter(
    (booking) => getDisplayStatus(booking) === activeTab,
  );

  const countFor = (s: ViewTab) =>
    restaurantBookings.filter((booking) => getDisplayStatus(booking) === s)
      .length;

  const handleComplete = (id: string) => {
    completeBooking(id);
  };

  const handleCancel = (id: string) => {
    const shouldCancel = window.confirm(
      "Cancel this reservation? This action cannot be undone.",
    );
    if (!shouldCancel) return;
    cancelBooking(id);
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
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-52 flex-col items-center justify-center text-muted-foreground"
          >
            <CalendarDays className="mb-3 h-14 w-14 opacity-20" />
            <p className="text-sm font-medium">No {activeTab} reservations</p>
            <p className="mt-1 text-xs opacity-60">
              Your {activeTab} reservations will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking, i) => {
              const displayStatus = getDisplayStatus(booking);
              return (
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
                          {booking.restaurantName}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusColor[displayStatus]}`}
                        >
                          {displayStatus}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Ref: {booking.bookingReference}
                      </span>
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
                          <span>
                            {booking.tableNumber
                              ? `Table ${booking.tableNumber}`
                              : "No table assigned"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {booking.bookingName && (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Booked by: {booking.bookingName}
                        {booking.bookingEmail
                          ? ` (${booking.bookingEmail})`
                          : ""}
                      </p>
                    )}

                    {booking.specialRequests && (
                      <p className="mt-1 text-[11px] text-muted-foreground italic">
                        Note: {booking.specialRequests}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {displayStatus === "upcoming" && (
                    <div className="flex gap-2 border-t border-border px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl text-xs text-destructive border-destructive/20 hover:bg-destructive/5"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl text-xs"
                        onClick={() => handleComplete(booking.id)}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantBookingsPage;
