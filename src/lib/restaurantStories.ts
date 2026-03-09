import type { Restaurant, RestaurantStory } from "@/data/mockData";

export interface RestaurantStoryGroup {
  restaurant: Restaurant;
  stories: RestaurantStory[];
  latestStory: RestaurantStory;
}

export const hasRestaurantStories = (restaurant: Restaurant) =>
  (restaurant.stories?.length ?? 0) > 0;

export const getLatestRestaurantStory = (restaurant: Restaurant) =>
  restaurant.stories?.[restaurant.stories.length - 1];

export const getRestaurantStoryGroups = (
  restaurants: Restaurant[],
): RestaurantStoryGroup[] =>
  restaurants
    .filter(hasRestaurantStories)
    .map((restaurant) => ({
      restaurant,
      stories: restaurant.stories ?? [],
      latestStory: getLatestRestaurantStory(restaurant)!,
    }))
    .sort(
      (a, b) =>
        new Date(b.latestStory.postedAt).getTime() -
        new Date(a.latestStory.postedAt).getTime(),
    );

export const formatStoryAge = (postedAt: string) => {
  const deltaMs = Date.now() - new Date(postedAt).getTime();

  if (deltaMs < 60 * 60 * 1000) {
    const minutes = Math.max(1, Math.floor(deltaMs / (60 * 1000)));
    return `${minutes}m`;
  }

  if (deltaMs < 24 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(deltaMs / (60 * 60 * 1000)));
    return `${hours}h`;
  }

  const days = Math.max(1, Math.floor(deltaMs / (24 * 60 * 60 * 1000)));
  return `${days}d`;
};
