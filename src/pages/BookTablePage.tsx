import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { mockRestaurants } from "@/data/mockData";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  Minus,
  Plus,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingsContext";
import { goBackOr } from "@/lib/navigation";
import { EMAIL_REGEX } from "@/lib/authValidation";
import {
  formatDateISO,
  getBookableSlots,
  getSuggestedTable,
} from "@/lib/bookingAvailability";

const generateBookingReference = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 5 }, () => {
    const idx = Math.floor(Math.random() * chars.length);
    return chars[idx];
  }).join("");
  return `RRA-${suffix}`;
};

interface BookTableLocationState {
  mode?: "modify";
  bookingId?: string;
  fromHistory?: boolean;
}

const BookTablePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { bookings, addBooking, updateBooking } = useBookings();
  const restaurant = mockRestaurants.find((r) => r.id === id);
  const pageState = (location.state as BookTableLocationState | null) ?? null;
  const bookingToModify =
    pageState?.mode === "modify" && pageState.bookingId
      ? bookings.find(
          (booking) =>
            booking.id === pageState.bookingId &&
            booking.restaurantId === id &&
            booking.status === "upcoming",
        )
      : undefined;
  const isModifyMode = !!bookingToModify;

  const [guests, setGuests] = useState(bookingToModify?.guests ?? 1);
  const [selectedDate, setSelectedDate] = useState(
    bookingToModify?.date ?? formatDateISO(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState(bookingToModify?.time ?? "");
  const [showCalendar, setShowCalendar] = useState(false);
  const [specialRequests, setSpecialRequests] = useState(
    bookingToModify?.specialRequests ?? "",
  );
  const [bookingName, setBookingName] = useState(
    bookingToModify?.bookingName || user?.name || "",
  );
  const [bookingEmail, setBookingEmail] = useState(
    bookingToModify?.bookingEmail || user?.email || "",
  );

  if (!restaurant) return null;

  if (isGuest && !isAuthenticated) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="safe-area-top" />
        <div className="flex-1 px-5 flex flex-col items-center justify-center">
          <CalendarDays className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-lg font-bold text-foreground">Sign in to book tables</h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Guest mode lets you browse restaurants, but reservation checkout
            requires an account.
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
      </div>
    );
  }

  const selectedDateObj = new Date(`${selectedDate}T00:00:00`);
  const calendarYear = selectedDateObj.getFullYear();
  const calendarMonth = selectedDateObj.getMonth();
  const monthNameFull = selectedDateObj.toLocaleString("default", {
    month: "long",
  });
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i);
    return {
      iso: formatDateISO(day),
      day: day.toLocaleString("default", { weekday: "short" }),
      num: day.getDate(),
      month: day.toLocaleString("default", { month: "short" }),
    };
  });

  const getSlotTable = (slot: string) =>
    getSuggestedTable({
      bookings,
      restaurantId: restaurant.id,
      date: selectedDate,
      slot,
      guests,
      currentBookingId: bookingToModify?.id,
      currentTableNumber: bookingToModify?.tableNumber,
    });

  const suggestedTable = selectedTime ? getSlotTable(selectedTime) : null;
  const bookableSlots = getBookableSlots({
    slots: restaurant.availableSlots,
    bookings,
    restaurantId: restaurant.id,
    date: selectedDate,
    guests,
    currentBookingId: bookingToModify?.id,
    currentTableNumber: bookingToModify?.tableNumber,
  });
  const bookableSlotSet = new Set(bookableSlots);
  const hasAvailabilityForSelection = bookableSlots.length > 0;

  const handleBook = () => {
    if (!selectedTime || !bookingName.trim() || !bookingEmail.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!EMAIL_REGEX.test(bookingEmail.trim())) {
      toast.error("Please enter a valid email");
      return;
    }

    const table = getSlotTable(selectedTime);
    if (!table) {
      toast.error("No table available for this slot. Please choose another time.");
      return;
    }

    const bookingReference =
      bookingToModify?.bookingReference ?? generateBookingReference();

    if (bookingToModify) {
      const result = updateBooking(bookingToModify.id, {
        date: selectedDate,
        time: selectedTime,
        guests,
        specialRequests: specialRequests || undefined,
        tableNumber: table.number,
        bookingName: bookingName.trim(),
        bookingEmail: bookingEmail.trim(),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } else {
      addBooking({
        bookingReference,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        date: selectedDate,
        time: selectedTime,
        guests,
        status: "upcoming",
        specialRequests: specialRequests || undefined,
        tableNumber: table.number,
        bookingName: bookingName.trim(),
        bookingEmail: bookingEmail.trim(),
      });
    }

    navigate("/booking-confirmation", {
      state: {
        isModification: !!bookingToModify,
        title: bookingToModify ? "Booking Updated!" : "Booking Confirmed!",
        message: bookingToModify
          ? "Your reservation has been updated successfully"
          : "Your table has been reserved successfully",
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        restaurantAddress: restaurant.address,
        bookingReference,
        date: selectedDateObj.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: selectedTime,
        guests,
        tableNumber: table.number,
        bookingName: bookingName.trim(),
        bookingEmail: bookingEmail.trim(),
        specialRequests,
      },
    });
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top bg-foreground">
        <div className="flex items-center gap-3 px-5 py-3">
          <button
            onClick={() =>
              goBackOr(
                navigate,
                isModifyMode ? "/history" : `/restaurant/${restaurant.id}`,
              )
            }
            className="rounded-full p-2 hover:bg-background/10 active:scale-90 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-background" />
          </button>
          <h1 className="text-lg font-bold text-background">
            {isModifyMode ? "Modify Booking" : "Book a Table"}
          </h1>
        </div>

        <div className="mx-5 mb-4 rounded-2xl border border-background/15 p-4">
          <h2 className="text-sm font-bold text-background">{restaurant.name}</h2>
          <p className="mt-0.5 text-[11px] text-background/50">
            {restaurant.cuisine}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-background/50">
            <MapPin className="h-3 w-3" /> {restaurant.address}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-5 space-y-4">
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Date
                </p>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {selectedDateObj.toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 hover:bg-secondary transition-colors"
              >
                <CalendarDays className="h-4 w-4 text-foreground" />
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform ${showCalendar ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {!showCalendar ? (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {weekDays.map((day) => (
                  <button
                    key={day.iso}
                    onClick={() => setSelectedDate(day.iso)}
                    className={`flex flex-col items-center rounded-2xl border px-4 py-2.5 min-w-[72px] transition-all active:scale-95 ${
                      selectedDate === day.iso
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="text-[10px] font-medium">{day.day}</span>
                    <span className="text-lg font-bold">{day.num}</span>
                    <span className="text-[10px] opacity-70">{day.month}</span>
                  </button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3"
              >
                <p className="text-center text-sm font-bold text-foreground mb-3">
                  {monthNameFull} {calendarYear}
                </p>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-muted-foreground py-1"
                    >
                      {day}
                    </span>
                  ))}
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {calendarDays.map((day) => {
                    const dayDate = new Date(calendarYear, calendarMonth, day);
                    const dayIso = formatDateISO(dayDate);
                    const startOfToday = new Date();
                    startOfToday.setHours(0, 0, 0, 0);
                    const isPast = dayDate < startOfToday;

                    return (
                      <button
                        key={day}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedDate(dayIso);
                          setShowCalendar(false);
                        }}
                        className={`rounded-full py-2 text-xs font-medium transition-all ${
                          selectedDate === dayIso
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : isPast
                              ? "text-muted-foreground/40 cursor-not-allowed"
                              : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          <div className="rounded-2xl border border-border p-4">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-2.5">
              <Clock className="h-3 w-3" /> Time
            </p>
            {!hasAvailabilityForSelection && (
              <div className="mb-3 rounded-xl bg-destructive/5 px-3 py-2.5">
                <p className="text-sm font-semibold text-destructive">
                  Fully booked for this date
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Try another date or adjust your party size to find an available
                  table.
                </p>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {restaurant.availableSlots.map((slot) => {
                const unavailable = !bookableSlotSet.has(slot);
                return (
                  <button
                    key={slot}
                    disabled={unavailable}
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                      unavailable
                        ? "border-border bg-muted text-muted-foreground cursor-not-allowed line-through"
                        : selectedTime === slot
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> Party size
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-base font-bold text-foreground">
                {guests} Guest{guests > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="rounded-full border border-border p-2 hover:bg-secondary transition-colors active:scale-90"
                >
                  <Minus className="h-4 w-4 text-foreground" />
                </button>
                <span className="text-lg font-bold text-foreground w-6 text-center">
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(20, guests + 1))}
                  className="rounded-full bg-primary p-2 shadow-md shadow-primary/20 active:scale-90 transition-transform"
                >
                  <Plus className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <p className="text-[11px] font-medium text-muted-foreground">
              Availability check
            </p>
            {!hasAvailabilityForSelection ? (
              <p className="mt-1 text-sm font-semibold text-destructive">
                No tables available on{" "}
                {selectedDateObj.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                for {guests} guest{guests > 1 ? "s" : ""}.
              </p>
            ) : !selectedTime ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Select a time to check availability and suggested table.
              </p>
            ) : suggestedTable ? (
              <>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Suggested table: #{suggestedTable.number}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Best fit for {guests} guest{guests > 1 ? "s" : ""} (up to{" "}
                  {suggestedTable.seats} seats).
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm font-semibold text-destructive">
                No suitable table available for this slot.
              </p>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">
              No-show reservations release their table after 30 minutes.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">
              Special Requests
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any dietary restriction, celebrations"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none h-20 placeholder:text-muted-foreground transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">
              Booking name
            </label>
            <Input
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1.5 h-12 rounded-2xl focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">
              Booking email
            </label>
            <Input
              type="email"
              value={bookingEmail}
              onChange={(e) => setBookingEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1.5 h-12 rounded-2xl focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <Button
            variant="cta"
            size="lg"
            className="w-full mb-4"
            disabled={!hasAvailabilityForSelection}
            onClick={handleBook}
          >
            {!hasAvailabilityForSelection
              ? "No Tables Available"
              : isModifyMode
                ? "Save Changes"
                : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookTablePage;
