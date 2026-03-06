import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, ClipboardList, Gift, CalendarDays, User } from "lucide-react";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/orders", icon: ClipboardList, label: "Order" },
  { to: "/rewards", icon: Gift, label: "Reward" },
  { to: "/history", icon: CalendarDays, label: "History" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40">
      <div className="flex items-center justify-around pt-2 pb-7">
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
                {tab.label === "Reward" ? (
                  <div className={`-mt-5 rounded-full p-3 shadow-lg transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground scale-110" 
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    <tab.icon className="h-5 w-5" />
                  </div>
                ) : (
                  <tab.icon className={`h-5 w-5 transition-all ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`} />
                )}
                <span className={`transition-all ${isActive ? "font-semibold" : ""}`}>{tab.label}</span>
              </>
            )}
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
