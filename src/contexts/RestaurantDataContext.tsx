/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import restaurantHero from "@/assets/restaurant-4.jpg";
import food1 from "@/assets/food/food-1.jpeg";
import food2 from "@/assets/food/food-2.jpeg";
import food3 from "@/assets/food/food-3.jpeg";
import food4 from "@/assets/food/food-4.jpeg";
import {
  mockRestaurants,
  type Restaurant,
  type RestaurantMenuItem,
  type RestaurantStory,
} from "@/data/mockData";

const RESTAURANTS_KEY = "rra_restaurants_v1";

export const MANAGED_RESTAURANT_ID = "owner-restaurant";

const ownerRestaurantSeed: Restaurant = {
  id: MANAGED_RESTAURANT_ID,
  name: "Malis Restaurant",
  cuisine: "Khmer restaurant • Family dining • Local favorites",
  description:
    "A warm Phnom Penh dining room serving Khmer classics, celebration dinners, and shared family-style plates for lunch and late evening bookings.",
  address: "No. 136, Street 41, BKK1, Phnom Penh",
  rating: 4.7,
  reviewCount: 186,
  distance: "0.6 miles",
  openUntil: "10:00pm",
  isOpen: true,
  image: restaurantHero,
  priceRange: "$$",
  tags: ["Khmer", "BKK1", "Family dining", "Local favorite"],
  type: "restaurant",
  availableSlots: [
    "11:30am",
    "12:30pm",
    "1:30pm",
    "6:00pm",
    "7:00pm",
    "8:00pm",
  ],
  menu: [
    {
      id: "owner-menu-1",
      name: "Fish Amok",
      description:
        "Steamed fish curry in banana leaf with kroeung, coconut cream, and herbs.",
      price: "$7.50",
      category: "Main",
      image: food1,
      status: "available",
    },
    {
      id: "owner-menu-2",
      name: "Lok Lak",
      description:
        "Marinated beef, pepper-lime sauce, and crisp vegetables served with rice.",
      price: "$6.50",
      category: "Main",
      image: food2,
      status: "available",
    },
    {
      id: "owner-menu-3",
      name: "Prahok Ktiss",
      description:
        "Creamy minced pork and fermented fish dip served with fresh vegetables.",
      price: "$5.00",
      category: "Starter",
      image: food3,
      status: "time_based",
    },
    {
      id: "owner-menu-4",
      name: "Num Banh Chok",
      description:
        "Traditional Khmer rice noodles with green fish gravy and seasonal herbs.",
      price: "$4.50",
      category: "Noodles",
      image: food4,
      status: "available",
    },
  ],
  stories: [
    {
      id: "owner-story-1",
      image: restaurantHero,
      headline: "Tonight's Khmer dinner service is open",
      caption:
        "Family-style tables and signature amok plates are available for evening reservations.",
      postedAt: "2026-03-10T06:00:00.000Z",
      durationSeconds: 5,
    },
  ],
};

interface RestaurantDataContextType {
  restaurants: Restaurant[];
  managedRestaurantId: string;
  managedRestaurant: Restaurant;
  getRestaurantById: (restaurantId: string) => Restaurant | undefined;
  updateRestaurant: (restaurantId: string, updates: Partial<Restaurant>) => void;
  updateManagedRestaurant: (updates: Partial<Restaurant>) => void;
  addMenuItem: (item: Omit<RestaurantMenuItem, "id"> & { id?: string }) => void;
  updateMenuItem: (
    itemId: string,
    updates: Partial<RestaurantMenuItem>,
  ) => void;
  removeMenuItem: (itemId: string) => void;
  addStory: (
    story: Omit<RestaurantStory, "id" | "postedAt"> & {
      id?: string;
      postedAt?: string;
    },
  ) => void;
  removeStory: (storyId: string) => void;
}

const RestaurantDataContext = createContext<RestaurantDataContextType | null>(
  null,
);

const normalizeMenuItems = (
  restaurantId: string,
  items: RestaurantMenuItem[],
): RestaurantMenuItem[] =>
  items.map((item, index) => ({
    ...item,
    id: item.id ?? `${restaurantId}-menu-${index + 1}`,
  }));

const normalizeRestaurant = (restaurant: Restaurant): Restaurant => ({
  ...restaurant,
  menu: normalizeMenuItems(restaurant.id, restaurant.menu ?? []),
  tags: Array.isArray(restaurant.tags) ? restaurant.tags : [],
  availableSlots: Array.isArray(restaurant.availableSlots)
    ? restaurant.availableSlots
    : [],
  stories: Array.isArray(restaurant.stories) ? restaurant.stories : [],
});

const buildRestaurantCollection = (restaurants: Restaurant[]) => {
  const withoutOwner = restaurants.filter(
    (restaurant) => restaurant.id !== MANAGED_RESTAURANT_ID,
  );
  const existingOwner = restaurants.find(
    (restaurant) => restaurant.id === MANAGED_RESTAURANT_ID,
  );
  const ownerRestaurant = normalizeRestaurant({
    ...ownerRestaurantSeed,
    ...existingOwner,
    menu:
      existingOwner &&
      Array.isArray(existingOwner.menu) &&
      existingOwner.menu.length > 0
        ? existingOwner.menu
        : ownerRestaurantSeed.menu,
    tags:
      existingOwner &&
      Array.isArray(existingOwner.tags) &&
      existingOwner.tags.length > 0
        ? existingOwner.tags
        : ownerRestaurantSeed.tags,
    availableSlots:
      existingOwner &&
      Array.isArray(existingOwner.availableSlots) &&
      existingOwner.availableSlots.length > 0
        ? existingOwner.availableSlots
        : ownerRestaurantSeed.availableSlots,
    stories:
      existingOwner &&
      Array.isArray(existingOwner.stories) &&
      existingOwner.stories.length > 0
        ? existingOwner.stories
        : ownerRestaurantSeed.stories,
  });

  return [ownerRestaurant, ...withoutOwner.map(normalizeRestaurant)];
};

const getStoredRestaurants = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RESTAURANTS_KEY) || "null");
    if (!Array.isArray(parsed)) {
      return buildRestaurantCollection(mockRestaurants);
    }
    return buildRestaurantCollection(parsed as Restaurant[]);
  } catch {
    return buildRestaurantCollection(mockRestaurants);
  }
};

export const useRestaurantData = () => {
  const ctx = useContext(RestaurantDataContext);
  if (!ctx) {
    throw new Error(
      "useRestaurantData must be used within RestaurantDataProvider",
    );
  }
  return ctx;
};

export const RestaurantDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(getStoredRestaurants);

  useEffect(() => {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  const updateRestaurant = (
    restaurantId: string,
    updates: Partial<Restaurant>,
  ) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === restaurantId
          ? normalizeRestaurant({
              ...restaurant,
              ...updates,
              menu: updates.menu ?? restaurant.menu,
              tags: updates.tags ?? restaurant.tags,
              availableSlots:
                updates.availableSlots ?? restaurant.availableSlots,
              stories: updates.stories ?? restaurant.stories,
            })
          : restaurant,
      ),
    );
  };

  const updateManagedRestaurant = (updates: Partial<Restaurant>) => {
    updateRestaurant(MANAGED_RESTAURANT_ID, updates);
  };

  const addMenuItem = (item: Omit<RestaurantMenuItem, "id"> & { id?: string }) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === MANAGED_RESTAURANT_ID
          ? normalizeRestaurant({
              ...restaurant,
              menu: [
                {
                  ...item,
                  id:
                    item.id ??
                    `menu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                },
                ...restaurant.menu,
              ],
            })
          : restaurant,
      ),
    );
  };

  const updateMenuItem = (
    itemId: string,
    updates: Partial<RestaurantMenuItem>,
  ) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === MANAGED_RESTAURANT_ID
          ? normalizeRestaurant({
              ...restaurant,
              menu: restaurant.menu.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item,
              ),
            })
          : restaurant,
      ),
    );
  };

  const removeMenuItem = (itemId: string) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === MANAGED_RESTAURANT_ID
          ? normalizeRestaurant({
              ...restaurant,
              menu: restaurant.menu.filter((item) => item.id !== itemId),
            })
          : restaurant,
      ),
    );
  };

  const addStory = (
    story: Omit<RestaurantStory, "id" | "postedAt"> & {
      id?: string;
      postedAt?: string;
    },
  ) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === MANAGED_RESTAURANT_ID
          ? normalizeRestaurant({
              ...restaurant,
              stories: [
                ...(restaurant.stories ?? []),
                {
                  ...story,
                  id:
                    story.id ??
                    `story-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  postedAt: story.postedAt ?? new Date().toISOString(),
                },
              ],
            })
          : restaurant,
      ),
    );
  };

  const removeStory = (storyId: string) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === MANAGED_RESTAURANT_ID
          ? normalizeRestaurant({
              ...restaurant,
              stories: (restaurant.stories ?? []).filter(
                (story) => story.id !== storyId,
              ),
            })
          : restaurant,
      ),
    );
  };

  const managedRestaurant =
    restaurants.find((restaurant) => restaurant.id === MANAGED_RESTAURANT_ID) ??
    ownerRestaurantSeed;
  const value = {
    restaurants,
    managedRestaurantId: MANAGED_RESTAURANT_ID,
    managedRestaurant,
    getRestaurantById: (restaurantId: string) =>
      restaurants.find((restaurant) => restaurant.id === restaurantId),
    updateRestaurant,
    updateManagedRestaurant,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    addStory,
    removeStory,
  };

  return (
    <RestaurantDataContext.Provider value={value}>
      {children}
    </RestaurantDataContext.Provider>
  );
};
