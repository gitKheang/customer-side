import { describe, expect, it } from "vitest";
import type { Booking } from "@/data/mockData";
import {
  getBookableSlots,
  getSuggestedTable,
  tableInventory,
} from "@/lib/bookingAvailability";

const buildBooking = (
  id: string,
  tableNumber: number,
  overrides: Partial<Booking> = {},
): Booking => ({
  id,
  bookingReference: `RRA-${id}`,
  restaurantId: "1",
  restaurantName: "Romeo Lane",
  restaurantImage: "/restaurant.jpg",
  date: "2026-03-10",
  time: "7:00pm",
  guests: 2,
  status: "upcoming",
  tableNumber,
  bookingName: "Test User",
  bookingEmail: "test@example.com",
  ...overrides,
});

describe("bookingAvailability", () => {
  it("reports no bookable slots when every table is occupied", () => {
    const bookings = tableInventory.map((table) =>
      buildBooking(`booking-${table.number}`, table.number),
    );

    const slots = getBookableSlots({
      slots: ["7:00pm"],
      bookings,
      restaurantId: "1",
      date: "2026-03-10",
      guests: 2,
      now: new Date("2026-03-09T12:00:00"),
    });

    expect(slots).toEqual([]);
  });

  it("keeps the current table when modifying an upcoming booking", () => {
    const suggestedTable = getSuggestedTable({
      bookings: [
        buildBooking("current-booking", 10, { guests: 4 }),
        buildBooking("other-booking", 1),
      ],
      restaurantId: "1",
      date: "2026-03-10",
      slot: "7:00pm",
      guests: 4,
      currentBookingId: "current-booking",
      currentTableNumber: 10,
      now: new Date("2026-03-09T12:00:00"),
    });

    expect(suggestedTable?.number).toBe(10);
  });
});
