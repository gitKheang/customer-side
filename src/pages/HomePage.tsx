import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Bell, Clock, MapPin, Heart, Star, ChevronRight } from "lucide-react";
import { mockRestaurants } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import FilterSheet from "@/components/FilterSheet";
import { motion } from "framer-motion";
import foodImage from "@/assets/food-avocado-toast.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFav = (id: string) =>
    setFavorites((p) => (p.includes(id) ? p.filter((f) => f !== id) : [...p, id]));

  const categories = [
    { emoji: "🍽️", label: "Restaurants" },
    { emoji: "🍺", label: "Pubs" },
    { emoji: "🎉", label: "Night clubs" },
  ];

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Status bar area */}
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm font-bold text-primary">W</div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Good evening!</h1>
            <p className="text-xs text-muted-foreground">Enjoy the experience - dine, order and earn</p>
          </div>
        </div>
        <button className="rounded-full border border-border p-2">
          <Bell className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Search */}
        <div className="flex items-center gap-2 px-5 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Enter postcode or town or city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="rounded-2xl bg-primary p-3"
          >
            <SlidersHorizontal className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 px-5 py-2">
          <button className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <span className="text-lg">🪑</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Order at table</p>
              <p className="text-[10px] text-muted-foreground">Scan QR to order</p>
            </div>
          </button>
          <button className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <span className="text-lg">💳</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Pay & Go</p>
              <p className="text-[10px] text-muted-foreground">Pay instantly via app</p>
            </div>
          </button>
        </div>

        {/* Loyalty Banner */}
        <div className="mx-5 mt-3 rounded-2xl bg-foreground p-5">
          <h3 className="text-base font-bold text-background">Join Our Loyalty Program</h3>
          <p className="mt-1 text-xs text-background/70">
            Turn every visit into reward - dine, earn, and enjoy exclusive member benefits
          </p>
          <button className="mt-3 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">
            Join now
          </button>
        </div>

        {/* AI Diet Coach Card */}
        <div className="mx-5 mt-4 rounded-2xl bg-gradient-to-r from-foreground to-foreground/80 p-5 relative overflow-hidden">
          <p className="text-sm font-medium text-background/90 italic max-w-[65%]">
            "Today's tip: Add more fiber to your lunch."
          </p>
          <p className="mt-1 text-xs text-background/60">Your AI Diet Coach</p>
          <button className="mt-2 rounded-lg bg-background/20 px-3 py-1.5 text-[10px] font-semibold text-background backdrop-blur-sm">
            Get Tips
          </button>
          <img src={foodImage} alt="Food" className="absolute right-0 top-0 h-full w-28 object-cover opacity-40 rounded-r-2xl" />
        </div>

        {/* Categories */}
        <div className="flex gap-3 px-5 py-4">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate("/search")}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5"
            >
              <span>{c.emoji}</span>
              <span className="text-sm font-medium text-foreground">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Top Restaurants */}
        <div className="px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Top restaurants in London</h2>
            <button onClick={() => navigate("/search")} className="text-xs font-medium text-primary">See all</button>
          </div>

          <div className="mt-3 space-y-4">
            {mockRestaurants.slice(0, 3).map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/restaurant/${r.id}`)}
                className="w-full text-left"
              >
                <div className="overflow-hidden rounded-2xl">
                  <div className="relative h-44">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur-sm px-2 py-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs font-bold text-foreground">{r.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between pt-2.5">
                    <div>
                      <p className="font-semibold text-foreground">{r.name}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Open Until {r.openUntil}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {r.distance}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }}
                        className="p-1"
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(r.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                      </button>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        Details <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
      <FilterSheet open={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
};

export default HomePage;
