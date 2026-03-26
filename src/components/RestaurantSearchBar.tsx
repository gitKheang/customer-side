import { FormEvent, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mockRestaurants, type Restaurant } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  getRestaurantSuggestions,
  parseDistanceMiles,
} from "@/lib/restaurantSearch";

interface RestaurantSearchBarProps {
  autoFocus?: boolean;
  className?: string;
  disableSuggestionAnimation?: boolean;
  forceSuggestionsOpen?: boolean;
  formClassName?: string;
  inputClassName?: string;
  placeholder: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSubmit: (query: string) => void;
}

const RestaurantSearchBar = ({
  autoFocus = false,
  className,
  disableSuggestionAnimation = false,
  forceSuggestionsOpen = false,
  formClassName,
  inputClassName,
  placeholder,
  query,
  onQueryChange,
  onSelectRestaurant,
  onSubmit,
}: RestaurantSearchBarProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(
    () => getRestaurantSuggestions(mockRestaurants, query),
    [query],
  );
  const showSuggestions =
    (forceSuggestionsOpen || isFocused) && query.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFocused(false);
    onSubmit(query.trim());
  };

  const handleBlur = () => {
    requestAnimationFrame(() => {
      if (!wrapperRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
      }
    });
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)} onBlur={handleBlur}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex min-w-0 items-center gap-2.5 rounded-2xl bg-secondary px-4 py-3.5",
          formClassName,
        )}
      >
        <button
          type="submit"
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Search restaurants"
        >
          <Search className="h-4 w-4" />
        </button>
        <input
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            inputClassName,
          )}
          placeholder={placeholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
        />
      </form>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={disableSuggestionAnimation ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              disableSuggestionAnimation ? undefined : { opacity: 0, y: -6 }
            }
            transition={disableSuggestionAnimation ? { duration: 0 } : undefined}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[22rem] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background shadow-xl shadow-black/5 scrollbar-hide"
          >
            {suggestions.length > 0 ? (
              suggestions.map((restaurant) => (
                <button
                  key={restaurant.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onQueryChange(restaurant.name);
                    setIsFocused(false);
                    onSelectRestaurant(restaurant);
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b border-border/70 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-secondary"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {restaurant.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {restaurant.address}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                    {parseDistanceMiles(restaurant.distance).toFixed(1)} mi
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No nearby restaurants match "{query.trim()}".
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantSearchBar;
