import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  rating: number;
  reviewCount: number;
  distance: string;
  openUntil: string;
  isOpen: boolean;
  image: string;
  priceRange: string;
  tags: string[];
  availableSlots: string[];
  menu: { name: string; price: string; category: string }[];
}

export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  guests: number;
  status: "upcoming" | "completed" | "cancelled";
  specialRequests?: string;
  tableNumber?: number;
  bookingName: string;
  bookingEmail: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Romeo Lane",
    cuisine: "Crafted Cocktails • Gourmet Cuisine • Best Bar",
    description: "Experience the finest gourmet dining with crafted cocktails in an elegant, intimate setting.",
    address: "7 Bell Yard, Holborn",
    rating: 4.5,
    reviewCount: 1200,
    distance: "0.3 miles",
    openUntil: "11:00pm",
    isOpen: true,
    image: restaurant1,
    priceRange: "$$$",
    tags: ["Italian", "Fine Dining", "Cocktails"],
    availableSlots: ["12:30pm", "1:30pm", "2:00pm", "4:00pm", "4:30pm", "6:30pm"],
    menu: [
      { name: "Truffle Pasta", price: "$28", category: "Main" },
      { name: "Wagyu Steak", price: "$55", category: "Main" },
      { name: "Caesar Salad", price: "$16", category: "Starter" },
      { name: "Tiramisu", price: "$14", category: "Dessert" },
    ],
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    cuisine: "Japanese • Sushi • Omakase",
    description: "Authentic Japanese sushi bar with daily fresh imports and an exceptional omakase experience.",
    address: "23 King Street, Covent Garden",
    rating: 4.8,
    reviewCount: 890,
    distance: "0.5 miles",
    openUntil: "10:30pm",
    isOpen: true,
    image: restaurant2,
    priceRange: "$$$$",
    tags: ["Japanese", "Sushi", "Premium"],
    availableSlots: ["1:00pm", "2:30pm", "5:00pm", "7:00pm", "8:30pm"],
    menu: [
      { name: "Omakase Set", price: "$85", category: "Set Menu" },
      { name: "Salmon Sashimi", price: "$22", category: "Sashimi" },
      { name: "Dragon Roll", price: "$18", category: "Rolls" },
      { name: "Matcha Ice Cream", price: "$10", category: "Dessert" },
    ],
  },
  {
    id: "3",
    name: "Bella Trattoria",
    cuisine: "Italian • Pasta • Wood-fired Pizza",
    description: "Traditional Italian cooking in a charming rustic setting with wood-fired pizzas and homemade pasta.",
    address: "15 Neal Street, Seven Dials",
    rating: 4.1,
    reviewCount: 2100,
    distance: "0.8 miles",
    openUntil: "10:00pm",
    isOpen: true,
    image: restaurant3,
    priceRange: "$$",
    tags: ["Italian", "Pizza", "Family"],
    availableSlots: ["12:00pm", "1:00pm", "3:00pm", "5:30pm", "7:30pm", "9:00pm"],
    menu: [
      { name: "Margherita Pizza", price: "$15", category: "Pizza" },
      { name: "Spaghetti Carbonara", price: "$18", category: "Pasta" },
      { name: "Bruschetta", price: "$10", category: "Starter" },
      { name: "Panna Cotta", price: "$9", category: "Dessert" },
    ],
  },
  {
    id: "4",
    name: "SkyLounge Bar",
    cuisine: "Modern European • Cocktails • Views",
    description: "Rooftop dining with breathtaking city views, modern European cuisine and an award-winning cocktail menu.",
    address: "1 Poultry, Bank",
    rating: 4.3,
    reviewCount: 750,
    distance: "1.2 miles",
    openUntil: "12:00am",
    isOpen: true,
    image: restaurant4,
    priceRange: "$$$",
    tags: ["Rooftop", "European", "Bar"],
    availableSlots: ["5:00pm", "6:00pm", "7:30pm", "8:00pm", "9:30pm"],
    menu: [
      { name: "Pan-Seared Duck", price: "$34", category: "Main" },
      { name: "Lobster Bisque", price: "$18", category: "Starter" },
      { name: "Signature Cocktail", price: "$16", category: "Drinks" },
      { name: "Chocolate Fondant", price: "$14", category: "Dessert" },
    ],
  },
  {
    id: "5",
    name: "Pret A Manger",
    cuisine: "Café • Sandwiches • Coffee",
    description: "Fresh, handmade food and organic coffee, served quickly and with a smile.",
    address: "42 Fleet Street, City",
    rating: 4.0,
    reviewCount: 3200,
    distance: "0.2 miles",
    openUntil: "3:00pm",
    isOpen: true,
    image: restaurant1,
    priceRange: "$",
    tags: ["Café", "Quick Bite", "Coffee"],
    availableSlots: ["11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm"],
    menu: [
      { name: "Club Sandwich", price: "$8", category: "Sandwich" },
      { name: "Flat White", price: "$4", category: "Coffee" },
      { name: "Greek Salad", price: "$7", category: "Salad" },
      { name: "Croissant", price: "$3", category: "Pastry" },
    ],
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    restaurantId: "1",
    restaurantName: "Romeo Lane",
    restaurantImage: restaurant1,
    date: "2026-03-15",
    time: "7:30pm",
    guests: 4,
    status: "upcoming",
    specialRequests: "Window seat preferred",
    tableNumber: 12,
    bookingName: "William",
    bookingEmail: "william@email.com",
  },
  {
    id: "b2",
    restaurantId: "2",
    restaurantName: "Sakura Sushi Bar",
    restaurantImage: restaurant2,
    date: "2026-03-10",
    time: "8:00pm",
    guests: 2,
    status: "completed",
    tableNumber: 5,
    bookingName: "William",
    bookingEmail: "william@email.com",
  },
  {
    id: "b3",
    restaurantId: "3",
    restaurantName: "Bella Trattoria",
    restaurantImage: restaurant3,
    date: "2026-03-08",
    time: "6:30pm",
    guests: 6,
    status: "cancelled",
    bookingName: "William",
    bookingEmail: "william@email.com",
  },
];

export const dietaryOptions = [
  { id: "dairy", name: "Dairy", emoji: "🥛" },
  { id: "fish", name: "Fish", emoji: "🐟" },
  { id: "gluten", name: "Gluten", emoji: "🌾" },
  { id: "meat", name: "Meat", emoji: "🥩" },
  { id: "nuts", name: "Nuts", emoji: "🥜" },
  { id: "soy", name: "Soy", emoji: "🫘" },
];

export const cuisineTypes = ["Italian", "Japanese", "Indian", "Chinese", "Thai", "Mexican", "French", "Korean"];
