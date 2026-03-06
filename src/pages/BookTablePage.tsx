import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockRestaurants } from "@/data/mockData";
import { ArrowLeft, CalendarDays, Clock, Users, Minus, Plus, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

const BookTablePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = mockRestaurants.find((r) => r.id === id);

  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(13);
  const [selectedTime, setSelectedTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");

  if (!restaurant) return null;

  const weekDays = [
    { day: "Wed", num: 10 },
    { day: "Thu", num: 11 },
    { day: "Fri", num: 12 },
    { day: "Sat", num: 13 },
    { day: "Sun", num: 14 },
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleBook = () => {
    if (!selectedTime || !bookingName) {
      toast.error("Please fill in all required fields");
      return;
    }
    navigate("/booking-confirmation", {
      state: {
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        date: `Dec ${selectedDate}, 2025`,
        time: selectedTime,
        guests,
        tableNumber: Math.floor(Math.random() * 20) + 1,
        bookingName,
        bookingEmail,
        specialRequests,
      },
    });
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <div className="safe-area-top bg-foreground">
        <div className="flex items-center gap-3 px-5 py-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 active:scale-90 transition-transform">
            <ArrowLeft className="h-5 w-5 text-background" />
          </button>
          <h1 className="text-base font-semibold text-background">Book a Table</h1>
        </div>

        <div className="mx-5 mb-4 rounded-2xl border border-background/15 p-4">
          <h2 className="text-sm font-bold text-background">{restaurant.name}</h2>
          <p className="mt-0.5 text-[11px] text-background/50">{restaurant.cuisine}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-background/50">
            <MapPin className="h-3 w-3" /> {restaurant.address}
          </p>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-5 space-y-4">
          {/* Date */}
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Date</p>
                <p className="text-base font-bold text-foreground mt-0.5">Sat {selectedDate} Dec</p>
              </div>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 hover:bg-secondary transition-colors"
              >
                <CalendarDays className="h-4 w-4 text-foreground" />
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${showCalendar ? "rotate-180" : ""}`} />
              </button>
            </div>

            {!showCalendar ? (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {weekDays.map((d) => (
                  <button
                    key={d.num}
                    onClick={() => setSelectedDate(d.num)}
                    className={`flex flex-col items-center rounded-2xl border px-4 py-2.5 min-w-[60px] transition-all active:scale-95 ${
                      selectedDate === d.num
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="text-[10px] font-medium">{d.day}</span>
                    <span className="text-lg font-bold">{d.num}</span>
                  </button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3"
              >
                <p className="text-center text-sm font-bold text-foreground mb-3">December 2025</p>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i} className="text-[10px] font-semibold text-muted-foreground py-1">{d}</span>
                  ))}
                  <div />
                  {calendarDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => { setSelectedDate(day); setShowCalendar(false); }}
                      className={`rounded-full py-2 text-xs font-medium transition-all ${
                        selectedDate === day
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : day < 10 ? "text-muted-foreground/40" : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Time */}
          <div className="rounded-2xl border border-border p-4">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-2.5"><Clock className="h-3 w-3" /> Time</p>
            <div className="flex gap-2 flex-wrap">
              {restaurant.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                    selectedTime === slot
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-border text-foreground hover:border-primary/30"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Party size */}
          <div className="rounded-2xl border border-border p-4">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Party size</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-base font-bold text-foreground">{guests} Guest{guests > 1 ? "s" : ""}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="rounded-full border border-border p-2 hover:bg-secondary transition-colors active:scale-90"
                >
                  <Minus className="h-4 w-4 text-foreground" />
                </button>
                <span className="text-lg font-bold text-foreground w-6 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(20, guests + 1))}
                  className="rounded-full bg-primary p-2 shadow-md shadow-primary/20 active:scale-90 transition-transform"
                >
                  <Plus className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any dietary restriction, Celebrations"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none h-20 placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Booking by */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Booking by</label>
            <Input
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              placeholder="Enter Your name"
              className="mt-1.5 h-12 rounded-2xl focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              value={bookingEmail}
              onChange={(e) => setBookingEmail(e.target.value)}
              placeholder="Enter Your email"
              className="mt-1.5 h-12 rounded-2xl focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <Button variant="cta" size="lg" className="w-full mb-4" onClick={handleBook}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookTablePage;
