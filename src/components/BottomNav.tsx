import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, Search, CalendarDays, User } from "lucide-react";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/history", icon: CalendarDays, label: "Bookings" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40">
      <div className="flex items-center justify-around pt-2 pb-7 safe-area-bottom">
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
                <span
                  className={`transition-all ${isActive ? "font-semibold" : ""}`}
                >
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

export default BottomNav;
