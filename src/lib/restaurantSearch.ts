import type { Restaurant } from "@/data/mockData";

export const parseDistanceMiles = (distance: string) => {
  const value = parseFloat(distance);
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
};

const getSearchableValues = (restaurant: Restaurant) => [
  restaurant.name,
  restaurant.cuisine,
  restaurant.address,
  restaurant.description,
  ...restaurant.tags,
];

const getMatchScore = (restaurant: Restaurant, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 3;
  }

  let bestScore = Number.POSITIVE_INFINITY;

  for (const value of getSearchableValues(restaurant)) {
    const normalizedValue = value.toLowerCase();
    const tokens = normalizedValue.split(/[^a-z0-9]+/).filter(Boolean);

    if (normalizedValue.startsWith(normalizedQuery)) {
      bestScore = Math.min(bestScore, 0);
      continue;
    }

    if (tokens.some((token) => token.startsWith(normalizedQuery))) {
      bestScore = Math.min(bestScore, 1);
      continue;
    }

    if (normalizedValue.includes(normalizedQuery)) {
      bestScore = Math.min(bestScore, 2);
    }
  }

  return Number.isFinite(bestScore) ? bestScore : null;
};

export const getMatchingRestaurants = (
  restaurants: Restaurant[],
  query: string,
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...restaurants].sort(
      (a, b) => parseDistanceMiles(a.distance) - parseDistanceMiles(b.distance),
    );
  }

  return restaurants
    .map((restaurant) => ({
      restaurant,
      score: getMatchScore(restaurant, normalizedQuery),
    }))
    .filter(
      (
        result,
      ): result is { restaurant: Restaurant; score: number } => result.score !== null,
    )
    .sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }

      const distanceDelta =
        parseDistanceMiles(a.restaurant.distance) -
        parseDistanceMiles(b.restaurant.distance);

      if (distanceDelta !== 0) {
        return distanceDelta;
      }

      return a.restaurant.name.localeCompare(b.restaurant.name);
    })
    .map(({ restaurant }) => restaurant);
};

export const getRestaurantSuggestions = (
  restaurants: Restaurant[],
  query: string,
  limit = 5,
) => getMatchingRestaurants(restaurants, query).slice(0, limit);
