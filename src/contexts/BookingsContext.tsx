/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Booking, mockBookings } from "@/data/mockData";
import { normalizeIdentifier } from "@/lib/authValidation";

export interface Notification {
  id: string;
  audience: "customer" | "restaurant";
  type:
    | "booking_confirmed"
    | "booking_cancelled"
    | "booking_modified"
    | "reminder";
  recipientEmail?: string;
  recipientIdentifier?: string;
  restaurantId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface BookingsContextType {
  bookings: Booking[];
  notifications: Notification[];
  addBooking: (booking: Omit<Booking, "id">) => void;
  cancelBooking: (id: string) => { success: boolean; message: string };
  completeBooking: (id: string) => { success: boolean; message: string };
  updateBooking: (
    id: string,
    updates: Pick<
      Booking,
      | "date"
      | "time"
      | "guests"
      | "specialRequests"
      | "tableNumber"
      | "bookingName"
      | "bookingEmail"
    >,
  ) => { success: boolean; message: string };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationsRead: (ids: string[]) => void;
  unreadCount: number;
}

const BookingsContext = createContext<BookingsContextType | null>(null);

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
};

const BOOKINGS_KEY = "rra_bookings";
const NOTIFICATIONS_KEY = "rra_notifications";
type StoredBooking = Booking | (Omit<Booking, "status"> & { status: "modified" });

function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

const normalizeStoredBookings = (bookings: StoredBooking[]): Booking[] =>
  bookings.map((booking) =>
    booking.status === "modified"
      ? {
          ...booking,
          status: "upcoming" as const,
        }
      : booking,
  );

/**
 * Merge stored bookings with mockBookings so that any newly-added mock
 * entries (e.g. owner-restaurant sample data) appear even when the user
 * already has cached bookings in localStorage.
 */
const mergeWithMockBookings = (stored: StoredBooking[]): StoredBooking[] => {
  const existingIds = new Set(stored.map((b) => b.id));
  const missing = mockBookings.filter((b) => !existingIds.has(b.id));
  return missing.length > 0 ? [...stored, ...missing] : stored;
};

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(() =>
    normalizeStoredBookings(
      mergeWithMockBookings(
        getStored<StoredBooking[]>(BOOKINGS_KEY, mockBookings),
      ),
    ),
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getStored(NOTIFICATIONS_KEY, []),
  );

  // Auto-complete past bookings so stored status stays in sync with display
  useEffect(() => {
    const now = new Date();
    const hasStale = bookings.some((b) => {
      if (b.status !== "upcoming") return false;
      const dt = new Date(`${b.date}T${convertTo24h(b.time)}:00`);
      return !Number.isNaN(dt.getTime()) && dt < now;
    });

    if (hasStale) {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.status !== "upcoming") return b;
          const dt = new Date(`${b.date}T${convertTo24h(b.time)}:00`);
          if (!Number.isNaN(dt.getTime()) && dt < now) {
            return { ...b, status: "completed" as const };
          }
          return b;
        }),
      );
    }
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    n: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const notification: Notification = {
      ...n,
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const addBooking = (booking: Omit<Booking, "id">) => {
    const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newBooking: Booking = { ...booking, id };
    setBookings((prev) => [newBooking, ...prev]);
    addNotification({
      audience: "customer",
      type: "booking_confirmed",
      recipientEmail: booking.bookingEmail,
      recipientIdentifier:
        booking.customerIdentifier || normalizeIdentifier(booking.bookingEmail),
      restaurantId: booking.restaurantId,
      title: "Booking Confirmed",
      message: `Reservation ${booking.bookingReference} at ${booking.restaurantName} on ${booking.date} at ${booking.time} is confirmed.`,
    });
    addNotification({
      audience: "restaurant",
      type: "booking_confirmed",
      recipientEmail: booking.bookingEmail,
      restaurantId: booking.restaurantId,
      title: "New Reservation",
      message: `${booking.bookingName} booked ${booking.date} at ${booking.time} for ${booking.guests} guests.`,
    });
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return { success: false, message: "Booking not found" };
    if (booking.status !== "upcoming") {
      return {
        success: false,
        message: "Only upcoming bookings can be cancelled",
      };
    }

    // Check 2-hour cancellation rule
    const bookingDateTime = new Date(
      `${booking.date}T${convertTo24h(booking.time)}`,
    );
    const now = new Date();
    const hoursUntilBooking =
      (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < 2) {
      return {
        success: false,
        message: "Cannot cancel within 2 hours of the booking time",
      };
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b,
      ),
    );
    addNotification({
      audience: "customer",
      type: "booking_cancelled",
      recipientEmail: booking.bookingEmail,
      recipientIdentifier:
        booking.customerIdentifier || normalizeIdentifier(booking.bookingEmail),
      restaurantId: booking.restaurantId,
      title: "Booking Cancelled",
      message: `Your booking at ${booking.restaurantName} on ${booking.date} at ${booking.time} has been cancelled.`,
    });
    addNotification({
      audience: "restaurant",
      type: "booking_cancelled",
      recipientEmail: booking.bookingEmail,
      restaurantId: booking.restaurantId,
      title: "Reservation Cancelled",
      message: `${booking.bookingName} cancelled ${booking.date} at ${booking.time}.`,
    });
    return { success: true, message: "Booking cancelled successfully" };
  };

  const updateBooking = (
    id: string,
    updates: Pick<
      Booking,
      | "date"
      | "time"
      | "guests"
      | "specialRequests"
      | "tableNumber"
      | "bookingName"
      | "bookingEmail"
    >,
  ) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return { success: false, message: "Booking not found" };
    if (booking.status !== "upcoming") {
      return {
        success: false,
        message: "Only upcoming bookings can be updated",
      };
    }

    const nextBooking = {
      ...booking,
      ...updates,
      status: "upcoming" as const,
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? nextBooking
          : b,
      ),
    );

    addNotification({
      audience: "customer",
      type: "booking_modified",
      recipientEmail: nextBooking.bookingEmail,
      recipientIdentifier:
        nextBooking.customerIdentifier ||
        normalizeIdentifier(nextBooking.bookingEmail),
      restaurantId: booking.restaurantId,
      title: "Booking Updated",
      message: `Your reservation ${booking.bookingReference} at ${booking.restaurantName} has been updated to ${nextBooking.date} at ${nextBooking.time}.`,
    });
    addNotification({
      audience: "restaurant",
      type: "booking_modified",
      recipientEmail: nextBooking.bookingEmail,
      restaurantId: booking.restaurantId,
      title: "Reservation Updated",
      message: `${nextBooking.bookingName} updated the reservation to ${nextBooking.date} at ${nextBooking.time}.`,
    });

    return {
      success: true,
      message: "Booking updated successfully",
    };
  };

  const completeBooking = (id: string) => {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) {
      return { success: false, message: "Booking not found" };
    }
    if (booking.status !== "upcoming") {
      return {
        success: false,
        message: "Only upcoming bookings can be marked complete",
      };
    }

    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "completed" as const } : item,
      ),
    );

    return { success: true, message: "Booking marked as completed" };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationsRead = (ids: string[]) => {
    const idSet = new Set(ids);
    setNotifications((prev) =>
      prev.map((notification) =>
        idSet.has(notification.id)
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        notifications,
        addBooking,
        cancelBooking,
        completeBooking,
        updateBooking,
        markNotificationRead,
        markAllNotificationsRead,
        markNotificationsRead,
        unreadCount,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

// Helper to convert "7:30pm" to "19:30"
function convertTo24h(time12h: string): string {
  const match = time12h.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return "00:00";
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}
