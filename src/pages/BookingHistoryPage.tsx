import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Clock, Users, CalendarDays, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useBookings } from "@/contexts/BookingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockRestaurants } from "@/data/mockData";

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

const getBookingDateTime = (date: string, time: string) => {
  return new Date(`${date}T${convertTo24h(time)}:00`);
};

type HistoryTab = "upcoming" | "past" | "cancelled";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useBookings();
  const { isAuthenticated, isGuest } = useAuth();
  const [tab, setTab] = useState<HistoryTab>("upcoming");

  const getDisplayStatus = (
    booking: (typeof bookings)[number],
  ): "upcoming" | "past" | "cancelled" => {
    if (booking.status === "cancelled") return "cancelled";
    if (booking.status === "completed") return "past";

    const bookingDateTime = getBookingDateTime(booking.date, booking.time);
    const now = new Date();
    if (!Number.isNaN(bookingDateTime.getTime()) && bookingDateTime < now) {
      return "past";
    }

    return "upcoming";
  };

  const filtered = bookings.filter((booking) => {
    const status = getDisplayStatus(booking);
    return status === tab;
  });

  const handleCancel = (id: string) => {
    const shouldCancel = window.confirm(
      "Cancel this reservation? Free cancellation is available up to 2 hours before booking time.",
    );
    if (!shouldCancel) return;

    cancelBooking(id);
  };

  const handleModify = (id: string, restaurantId: string) => {
    navigate(`/book/${restaurantId}`, {
      state: {
        mode: "modify",
        bookingId: id,
        fromHistory: true,
      },
    });
  };

  const handleOpenDirections = (restaurantId: string) => {
    const restaurant = mockRestaurants.find((item) => item.id === restaurantId);

    if (!restaurant) {
      navigate(`/restaurant/${restaurantId}`);
      return;
    }

    const destination = encodeURIComponent(restaurant.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${destination}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // Guest mode restriction
  if (isGuest && !isAuthenticated) {
    return (
      <div className="relative flex h-full flex-col bg-background">
        <div className="safe-area-top" />
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <CalendarDays className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-lg font-bold text-foreground">
            Sign in to view bookings
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create an account or sign in to make reservations and view your
            booking history.
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

  const statusColor = {
    upcoming: "bg-primary/10 text-primary",
    past: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />
      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-foreground">Booking History</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Manage your reservations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-5 rounded-2xl bg-secondary p-1 mb-4">
        {(["upcoming", "past", "cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-medium capitalize transition-all ${
              tab === t
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground"
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
            <p className="text-xs mt-1 opacity-60">
              Your {tab} reservations will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => {
              const displayStatus = getDisplayStatus(b);
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border overflow-hidden card-shadow"
                >
                  {displayStatus === "upcoming" ? (
                    <div
                      className="w-full text-left"
                    >
                      <div className="flex gap-3 p-3.5">
                        <img
                          src={b.restaurantImage}
                          alt={b.restaurantName}
                          className="h-22 w-22 rounded-xl object-cover"
                          style={{ width: 88, height: 88 }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground text-sm truncate">
                                {b.restaurantName}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                Ref: {b.bookingReference}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize whitespace-nowrap ${statusColor[displayStatus]}`}
                            >
                              {displayStatus}
                            </span>
                          </div>
                          <div className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
                            <p className="flex items-center gap-1.5">
                              <CalendarDays className="h-3 w-3 text-primary/60" />{" "}
                              {b.date}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-primary/60" /> {b.time}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Users className="h-3 w-3 text-primary/60" />{" "}
                              {b.guests} Guests
                              {b.tableNumber ? ` • Table ${b.tableNumber}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="px-3.5 pb-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto rounded-full px-0 py-0 text-[11px] font-semibold text-primary hover:bg-transparent hover:text-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenDirections(b.restaurantId);
                          }}
                        >
                          <Navigation className="mr-1.5 h-3.5 w-3.5" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 p-3.5">
                      <img
                        src={b.restaurantImage}
                        alt={b.restaurantName}
                        className="h-22 w-22 rounded-xl object-cover"
                        style={{ width: 88, height: 88 }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-foreground text-sm truncate">
                              {b.restaurantName}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Ref: {b.bookingReference}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize whitespace-nowrap ${statusColor[displayStatus]}`}
                          >
                            {displayStatus}
                          </span>
                        </div>
                        <div className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
                          <p className="flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3 text-primary/60" />{" "}
                            {b.date}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-primary/60" /> {b.time}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 text-primary/60" />{" "}
                            {b.guests} Guests
                            {b.tableNumber ? ` • Table ${b.tableNumber}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                {displayStatus === "upcoming" && (
                  <div className="flex gap-2 border-t border-border px-3.5 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs rounded-xl"
                      onClick={() => handleModify(b.id, b.restaurantId)}
                    >
                      Modify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
                      onClick={() => handleCancel(b.id)}
                    >
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
                {(displayStatus === "past" ||
                  displayStatus === "cancelled") && (
                  <div className="border-t border-border px-3.5 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-xl"
                      onClick={() => navigate(`/book/${b.restaurantId}`)}
                    >
                      Book Table
                    </Button>
                  </div>
                )}
              </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default BookingHistoryPage;
