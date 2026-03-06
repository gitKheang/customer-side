import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, Star, Clock, MapPin, Heart, ChevronRight } from "lucide-react";
import { mockRestaurants } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import FilterSheet from "@/components/FilterSheet";
import { motion } from "framer-motion";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Restaurants");

  const categories = [
    { emoji: "🍽️", label: "Restaurants" },
    { emoji: "🍺", label: "Pubs" },
    { emoji: "🎉", label: "Night clubs" },
  ];

  const filtered = mockRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(query.toLowerCase())
  );

  const toggleFav = (id: string) =>
    setFavorites((p) => (p.includes(id) ? p.filter((f) => f !== id) : [...p, id]));

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-2">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-secondary transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Search nearby restaurants</h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2.5 px-5 py-2">
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-secondary px-4 py-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search restaurants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button onClick={() => setShowFilter(true)} className="rounded-2xl bg-primary p-3.5 shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          <SlidersHorizontal className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 py-2.5">
        {categories.map((c) => (
          <button
            key={c.label}
            onClick={() => setActiveCategory(c.label)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-medium transition-all active:scale-95 ${
              activeCategory === c.label
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/30"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <p className="py-2 text-xs text-muted-foreground">
          We have found ({filtered.length}) Restaurant !
        </p>

        <div className="space-y-5">
          {filtered.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              className="w-full text-left group"
            >
              <div className="relative h-44 overflow-hidden rounded-2xl">
                <img src={r.image} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-xs font-bold">{r.rating}</span>
                </div>
              </div>
              <div className="flex items-start justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Open Until {r.openUntil}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.distance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }} className="hover:scale-110 transition-transform">
                    <Heart className={`h-5 w-5 transition-colors ${favorites.includes(r.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>
                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-primary border border-primary/20 rounded-full px-3 py-1">
                    Details <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
      <FilterSheet open={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
};

export default SearchPage;
