import { afterEach, describe, expect, it, vi } from "vitest";
import type { Restaurant, RestaurantStory } from "@/data/mockData";
import {
  formatStoryAge,
  getLatestRestaurantStory,
  getRestaurantStoryGroups,
  hasRestaurantStories,
} from "@/lib/restaurantStories";

const buildStory = (id: string, postedAt: string): RestaurantStory => ({
  id,
  image: "/story.jpg",
  headline: `${id} headline`,
  caption: `${id} caption`,
  postedAt,
  durationSeconds: 5,
});

const buildRestaurant = (
  id: string,
  name: string,
  stories?: RestaurantStory[],
): Restaurant => ({
  id,
  name,
  cuisine: "Test cuisine",
  description: "Test description",
  address: "1 Test Street",
  rating: 4.2,
  reviewCount: 120,
  distance: "0.4 miles",
  openUntil: "10:00pm",
  isOpen: true,
  image: "/restaurant.jpg",
  priceRange: "$$",
  tags: ["Test"],
  type: "restaurant",
  availableSlots: ["7:00pm"],
  menu: [],
  stories,
});

describe("restaurantStories", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("filters restaurants without stories and sorts by latest post time", () => {
    const restaurants = [
      buildRestaurant("1", "Alpha", [
        buildStory("1-story-1", "2026-03-09T10:00:00.000Z"),
      ]),
      buildRestaurant("2", "Bravo"),
      buildRestaurant("3", "Charlie", [
        buildStory("3-story-1", "2026-03-09T12:30:00.000Z"),
        buildStory("3-story-2", "2026-03-09T15:00:00.000Z"),
      ]),
    ];

    const groups = getRestaurantStoryGroups(restaurants);

    expect(groups.map((group) => group.restaurant.name)).toEqual([
      "Charlie",
      "Alpha",
    ]);
    expect(groups[0].latestStory.id).toBe("3-story-2");
  });

  it("detects whether a restaurant currently has stories", () => {
    expect(hasRestaurantStories(buildRestaurant("1", "Alpha"))).toBe(false);
    expect(
      hasRestaurantStories(buildRestaurant("2", "Bravo", [
        buildStory("2-story-1", "2026-03-09T10:00:00.000Z"),
      ])),
    ).toBe(true);
  });

  it("returns the latest story from the story list", () => {
    const restaurant = buildRestaurant("1", "Alpha", [
      buildStory("1-story-1", "2026-03-09T10:00:00.000Z"),
      buildStory("1-story-2", "2026-03-09T11:00:00.000Z"),
    ]);

    expect(getLatestRestaurantStory(restaurant)?.id).toBe("1-story-2");
  });

  it("formats story age for minutes, hours, and days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-09T18:00:00.000Z"));

    expect(formatStoryAge("2026-03-09T17:45:00.000Z")).toBe("15m");
    expect(formatStoryAge("2026-03-09T14:00:00.000Z")).toBe("4h");
    expect(formatStoryAge("2026-03-07T18:00:00.000Z")).toBe("2d");
  });
});
