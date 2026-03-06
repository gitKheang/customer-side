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
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Search near by restaurant</h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 px-5 py-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search restaurants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button onClick={() => setShowFilter(true)} className="rounded-2xl bg-primary p-3">
          <SlidersHorizontal className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 py-2">
        {categories.map((c) => (
          <button
            key={c.label}
            onClick={() => setActiveCategory(c.label)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              activeCategory === c.label
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        <p className="py-2 text-xs text-muted-foreground">
          We have found ({filtered.length}) Restaurant !
        </p>

        <div className="space-y-5">
          {filtered.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              className="w-full text-left"
            >
              <div className="relative h-44 overflow-hidden rounded-2xl">
                <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur-sm px-2 py-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-xs font-bold">{r.rating}</span>
                </div>
              </div>
              <div className="flex items-start justify-between pt-2">
                <div>
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Open Until {r.openUntil}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.distance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }}>
                    <Heart className={`h-5 w-5 ${favorites.includes(r.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary border border-border rounded-full px-3 py-1">
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
