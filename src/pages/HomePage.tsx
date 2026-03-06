import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Bell, Clock, MapPin, Heart, Star, ChevronRight } from "lucide-react";
import { mockRestaurants } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import FilterSheet from "@/components/FilterSheet";
import { motion } from "framer-motion";

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
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/10">
            W
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Good evening!</h1>
            <p className="text-[11px] text-muted-foreground">Enjoy the experience - dine, order and earn</p>
          </div>
        </div>
        <button className="relative rounded-full border border-border p-2.5 hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {/* Search */}
        <div className="flex items-center gap-2.5 px-5 py-2.5">
          <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-secondary px-4 py-3.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Enter postcode or town or city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate("/search")}
            />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="rounded-2xl bg-primary p-3.5 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 px-5 py-3">
          <button className="flex flex-1 items-center gap-3 rounded-2xl bg-background p-4 card-shadow border border-border/50 active:scale-[0.98] transition-transform">
            <div className="rounded-xl bg-primary/10 p-3">
              <span className="text-xl">🪑</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Order at table</p>
              <p className="text-[10px] text-muted-foreground">Scan QR to order</p>
            </div>
          </button>
          <button className="flex flex-1 items-center gap-3 rounded-2xl bg-background p-4 card-shadow border border-border/50 active:scale-[0.98] transition-transform">
            <div className="rounded-xl bg-primary/10 p-3">
              <span className="text-xl">💳</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Pay & Go</p>
              <p className="text-[10px] text-muted-foreground">Pay instantly via app</p>
            </div>
          </button>
        </div>

        {/* Loyalty Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-5 mt-1 rounded-3xl bg-foreground p-5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-base font-bold text-background">Join Our Loyalty Program</h3>
            <p className="mt-1.5 text-xs text-background/60 leading-relaxed max-w-[75%]">
              Turn every visit into reward - dine, earn, and enjoy exclusive member benefits
            </p>
            <button className="mt-3.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform">
              Join now
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 h-28 w-28 rounded-full bg-primary/15" />
          <div className="absolute right-8 -top-6 h-20 w-20 rounded-full bg-primary/10" />
        </motion.div>

        {/* Categories */}
        <div className="flex gap-2.5 px-5 py-4">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate("/search")}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95"
            >
              <span className="text-base">{c.emoji}</span>
              <span className="text-xs font-medium text-foreground">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Top Restaurants */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Top restaurants in London</h2>
            <button onClick={() => navigate("/search")} className="text-xs font-semibold text-primary">See all</button>
          </div>

          <div className="space-y-5">
            {mockRestaurants.slice(0, 3).map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                onClick={() => navigate(`/restaurant/${r.id}`)}
                className="w-full text-left group"
              >
                <div className="overflow-hidden rounded-2xl">
                  <div className="relative h-44 overflow-hidden rounded-2xl">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs font-bold text-foreground">{r.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between pt-3 pb-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
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
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Heart className={`h-5 w-5 transition-colors ${favorites.includes(r.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                      </button>
                      <span className="flex items-center gap-0.5 text-[11px] font-medium text-primary border border-primary/20 rounded-full px-3 py-1">
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
