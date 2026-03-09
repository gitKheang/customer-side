import { useState } from "react";
import type { Restaurant } from "@/data/mockData";
import { getLatestRestaurantStory } from "@/lib/restaurantStories";

const STORAGE_KEY = "restaurant-story-seen";

const readSeenStories = () => {
  if (typeof window === "undefined") {
    return {} as Record<string, string>;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const writeSeenStories = (value: Record<string, string>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

export const useRestaurantStoryState = () => {
  const [seenStories, setSeenStories] =
    useState<Record<string, string>>(readSeenStories);

  const isRestaurantStorySeen = (restaurant: Restaurant) => {
    const latestStory = getLatestRestaurantStory(restaurant);
    if (!latestStory) return true;
    return seenStories[restaurant.id] === latestStory.id;
  };

  const markRestaurantStorySeen = (restaurant: Restaurant) => {
    const latestStory = getLatestRestaurantStory(restaurant);
    if (!latestStory) return;

    setSeenStories((previous) => {
      if (previous[restaurant.id] === latestStory.id) {
        return previous;
      }

      const nextValue = {
        ...previous,
        [restaurant.id]: latestStory.id,
      };
      writeSeenStories(nextValue);
      return nextValue;
    });
  };

  return {
    isRestaurantStorySeen,
    markRestaurantStorySeen,
  };
};
