import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  Users,
  Mail,
  User,
  MapPin,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/home" replace />;
  }

  const openDirections = () => {
    if (!state.restaurantAddress) return;
    const destination = encodeURIComponent(state.restaurantAddress);
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${destination}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const details = [
    { icon: Hash, label: "Reference", value: state.bookingReference },
    { icon: CalendarDays, label: "Date", value: state.date },
    { icon: Clock, label: "Time", value: state.time },
    {
      icon: Users,
      label: "Guests",
      value: `${state.guests} Guest${state.guests > 1 ? "s" : ""}`,
    },
    { icon: Hash, label: "Table", value: `Table ${state.tableNumber}` },
    { icon: User, label: "Name", value: state.bookingName },
    { icon: Mail, label: "Email", value: state.bookingEmail },
    { icon: MapPin, label: "Location", value: state.restaurantAddress },
  ];

  return (
    <div className="flex h-full flex-col bg-background safe-area-top px-5">
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="rounded-full bg-success/10 p-5 mb-6"
        >
          <CheckCircle2 className="h-14 w-14 text-success" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your table has been reserved successfully
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 w-full rounded-2xl border border-border overflow-hidden"
        >
          {/* Restaurant header */}
          <div className="relative h-28 overflow-hidden">
            <img
              src={state.restaurantImage}
              alt={state.restaurantName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-base font-bold text-background">
                {state.restaurantName}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            {details
              .filter((d) => d.value)
              .map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary p-2">
                    <d.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {d.value}
                    </p>
                  </div>
                </div>
              ))}
            {state.specialRequests && (
              <div className="mt-2 rounded-xl bg-secondary/50 p-3">
                <p className="text-[10px] text-muted-foreground">
                  Special Requests
                </p>
                <p className="text-xs text-foreground mt-0.5">
                  {state.specialRequests}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full space-y-3 mb-8"
        >
          <Button
            variant="cta"
            size="lg"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/history")}
          >
            View My Bookings
          </Button>
          {state.restaurantAddress && (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={openDirections}
            >
              Get Directions
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
