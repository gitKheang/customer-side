import { describe, expect, it } from "vitest";
import type { Restaurant } from "@/data/mockData";
import {
  getMatchingRestaurants,
  getRestaurantSuggestions,
  parseDistanceMiles,
} from "@/lib/restaurantSearch";

const buildRestaurant = (
  id: string,
  name: string,
  distance: string,
  overrides: Partial<Restaurant> = {},
): Restaurant => ({
  id,
  name,
  cuisine: "Test Cuisine",
  description: "Sample description",
  address: "1 Test Street",
  rating: 4.5,
  reviewCount: 12,
  distance,
  openUntil: "10:00pm",
  isOpen: true,
  image: "/test.jpg",
  priceRange: "$$",
  tags: ["Sample"],
  type: "restaurant",
  availableSlots: ["7:00pm"],
  menu: [],
  ...overrides,
});

describe("restaurantSearch", () => {
  it("parses numeric distances from labels", () => {
    expect(parseDistanceMiles("0.3 miles")).toBe(0.3);
    expect(parseDistanceMiles("unknown")).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("sorts all restaurants by nearest distance when the query is empty", () => {
    const restaurants = [
      buildRestaurant("1", "Far Place", "3.2 miles"),
      buildRestaurant("2", "Near Place", "0.4 miles"),
      buildRestaurant("3", "Mid Place", "1.0 miles"),
    ];

    expect(getMatchingRestaurants(restaurants, "").map((item) => item.name)).toEqual([
      "Near Place",
      "Mid Place",
      "Far Place",
    ]);
  });

  it("prioritizes starts-with matches before loose includes", () => {
    const restaurants = [
      buildRestaurant("1", "Alpha Bistro", "1.2 miles"),
      buildRestaurant("2", "Coastal Kitchen", "0.2 miles", {
        description: "Known for alpha-inspired tasting menus.",
      }),
      buildRestaurant("3", "Alpine Cafe", "2.0 miles"),
    ];

    expect(
      getMatchingRestaurants(restaurants, "al").map((item) => item.name),
    ).toEqual(["Alpha Bistro", "Alpine Cafe", "Coastal Kitchen"]);
  });

  it("limits suggestions to the requested number of nearby matches", () => {
    const restaurants = [
      buildRestaurant("1", "Bravo", "0.8 miles"),
      buildRestaurant("2", "Bistro", "0.3 miles"),
      buildRestaurant("3", "Bakery", "0.1 miles"),
    ];

    expect(
      getRestaurantSuggestions(restaurants, "b", 2).map((item) => item.name),
    ).toEqual(["Bakery", "Bistro"]);
  });
});
