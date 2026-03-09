import type { Booking } from "@/data/mockData";

export const DEFAULT_DISCOVERY_GUESTS = 2;

export const tableInventory = Array.from({ length: 20 }, (_, idx) => {
  const number = idx + 1;
  let seats = 2;
  if (number > 6 && number <= 12) seats = 4;
  if (number > 12 && number <= 16) seats = 6;
  if (number > 16) seats = 8;
  return { number, seats };
});

export const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertTo24h = (time12h: string) => {
  const match = time12h.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return "00:00";
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

export const getBookingDateTime = (date: string, time: string) =>
  new Date(`${date}T${convertTo24h(time)}:00`);

export const bookingHoldsTable = (booking: Booking, now = new Date()) => {
  if (booking.status !== "upcoming") return false;

  const reservationTime = getBookingDateTime(booking.date, booking.time);
  if (Number.isNaN(reservationTime.getTime())) return false;

  const releaseTime = new Date(reservationTime.getTime() + 30 * 60 * 1000);
  return releaseTime > now;
};

interface SlotAvailabilityParams {
  bookings: Booking[];
  restaurantId: string;
  date: string;
  slot: string;
  guests: number;
  currentBookingId?: string;
  currentTableNumber?: number;
  now?: Date;
}

export const getSuggestedTable = ({
  bookings,
  restaurantId,
  date,
  slot,
  guests,
  currentBookingId,
  currentTableNumber,
  now = new Date(),
}: SlotAvailabilityParams) => {
  if (!slot) return null;

  const occupiedTables = new Set(
    bookings
      .filter(
        (booking) =>
          booking.id !== currentBookingId &&
          booking.restaurantId === restaurantId &&
          booking.date === date &&
          booking.time === slot &&
          bookingHoldsTable(booking, now) &&
          typeof booking.tableNumber === "number",
      )
      .map((booking) => booking.tableNumber as number),
  );

  const currentTable =
    typeof currentTableNumber === "number"
      ? tableInventory.find(
          (table) =>
            table.number === currentTableNumber &&
            table.seats >= guests &&
            !occupiedTables.has(table.number),
        )
      : null;

  return (
    currentTable ||
    tableInventory.find(
      (table) => table.seats >= guests && !occupiedTables.has(table.number),
    ) ||
    null
  );
};

export const canBookRestaurantSlot = (params: SlotAvailabilityParams) =>
  !!getSuggestedTable(params);

export const getBookableSlots = ({
  slots,
  ...params
}: Omit<SlotAvailabilityParams, "slot"> & { slots: string[] }) =>
  slots.filter((slot) => canBookRestaurantSlot({ ...params, slot }));
