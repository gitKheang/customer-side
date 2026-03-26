import { NavLink as RouterNavLink } from "react-router-dom";
import {
  LayoutGrid,
  UtensilsCrossed,
  Armchair,
  CalendarCheck2,
  User,
} from "lucide-react";

const tabs = [
  { to: "/restaurant-dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/restaurant-menu", icon: UtensilsCrossed, label: "Menu" },
  { to: "/restaurant-tables", icon: Armchair, label: "Tables" },
  { to: "/restaurant-bookings", icon: CalendarCheck2, label: "Bookings" },
  { to: "/restaurant-profile", icon: User, label: "Profile" },
];

const RestaurantBottomNav = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around pb-7 pt-2 safe-area-bottom">
        {tabs.map((tab) => (
          <RouterNavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-0.5 text-[10px] font-medium transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon
                  className={`h-5 w-5 transition-all ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className={isActive ? "font-semibold" : ""}>
                  {tab.label}
                </span>
              </>
            )}
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
};

export default RestaurantBottomNav;
