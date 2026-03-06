import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, List, Gift, BarChart3, User } from "lucide-react";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/orders", icon: List, label: "Order" },
  { to: "/rewards", icon: Gift, label: "Reward" },
  { to: "/history", icon: BarChart3, label: "History" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background border-t border-border safe-area-bottom z-40">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <RouterNavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {tab.label === "Reward" ? (
                  <div className={`rounded-full p-2 ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <tab.icon className="h-5 w-5" />
                  </div>
                ) : (
                  <tab.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                )}
                <span>{tab.label}</span>
              </>
            )}
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
