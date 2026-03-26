import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import {
  useRestaurantData,
  MANAGED_RESTAURANT_ID,
} from "@/contexts/RestaurantDataContext";
import type { RestaurantMenuItem } from "@/data/mockData";

const defaultMenuImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop";

const statusLabel: Record<
  NonNullable<RestaurantMenuItem["status"]>,
  string
> = {
  available: "available",
  sold_out: "sold out",
  time_based: "time based",
};

const statusColor: Record<
  NonNullable<RestaurantMenuItem["status"]>,
  string
> = {
  available: "bg-success/10 text-success",
  sold_out: "bg-destructive/10 text-destructive",
  time_based: "bg-primary/10 text-primary",
};

interface MenuDraft {
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  status: NonNullable<RestaurantMenuItem["status"]>;
}

const emptyDraft: MenuDraft = {
  name: "",
  description: "",
  category: "",
  price: "",
  image: "",
  status: "available",
};

const normalizePrice = (price: string) => {
  const trimmed = price.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
};

const RestaurantMenuPage = () => {
  const navigate = useNavigate();
  const { managedRestaurant, addMenuItem, updateMenuItem, removeMenuItem } =
    useRestaurantData();
  const [search, setSearch] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MenuDraft>(emptyDraft);

  const items = managedRestaurant.menu;
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => {
      const description = item.description ?? "";
      return (
        item.name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [items, search]);

  const counts = {
    available: items.filter((item) => item.status === "available").length,
    sold_out: items.filter((item) => item.status === "sold_out").length,
    time_based: items.filter((item) => item.status === "time_based").length,
  };

  const openCreateComposer = () => {
    setEditingItemId(null);
    setDraft(emptyDraft);
    setIsComposerOpen(true);
  };

  const openEditComposer = (item: RestaurantMenuItem) => {
    setEditingItemId(item.id ?? null);
    setDraft({
      name: item.name,
      description: item.description ?? "",
      category: item.category,
      price: item.price,
      image: item.image,
      status: item.status ?? "available",
    });
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingItemId(null);
    setDraft(emptyDraft);
  };

  const handleSaveItem = () => {
    const payload = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      category: draft.category.trim() || "Main",
      price: normalizePrice(draft.price),
      image: draft.image.trim() || defaultMenuImage,
      status: draft.status,
    };

    if (!payload.name || !payload.price) return;

    if (editingItemId) {
      updateMenuItem(editingItemId, payload);
    } else {
      addMenuItem(payload);
    }

    closeComposer();
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center justify-between gap-3 px-5 pb-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Menu</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Manage what customers see on your public restaurant page
          </p>
        </div>
        <Button
          variant="cta"
          size="sm"
          className="rounded-full"
          onClick={openCreateComposer}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <section className="overflow-hidden rounded-[28px] border border-[#e8d39d] bg-[linear-gradient(145deg,#fff7de_0%,#f8efcb_100%)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a6426]">
                Public menu sync
              </div>
              <h2 className="mt-3 text-xl font-bold text-[#2f2414]">
                {managedRestaurant.name}
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5f522f]">
                Menu changes here update the customer restaurant detail page.
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-white/75 px-3 py-3">
              <p className="text-[20px] font-bold text-emerald-600">
                {counts.available}
              </p>
              <p className="text-[11px] font-medium text-emerald-600">
                Available
              </p>
            </div>
            <div className="rounded-2xl bg-white/75 px-3 py-3">
              <p className="text-[20px] font-bold text-destructive">
                {counts.sold_out}
              </p>
              <p className="text-[11px] font-medium text-destructive">
                Sold out
              </p>
            </div>
            <div className="rounded-2xl bg-white/75 px-3 py-3">
              <p className="text-[20px] font-bold text-primary">
                {counts.time_based}
              </p>
              <p className="text-[11px] font-medium text-primary">
                Time based
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/80 bg-white/70"
              onClick={() => navigate("/restaurant-edit-listing")}
            >
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Listing
            </Button>
            <Button
              type="button"
              variant="cta"
              className="rounded-2xl"
              onClick={() => navigate(`/restaurant/${MANAGED_RESTAURANT_ID}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </section>

        {isComposerOpen && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-3xl border border-border p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {editingItemId ? "Edit menu item" : "New menu item"}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Keep titles, prices, and descriptions customer-ready.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={closeComposer}
              >
                Cancel
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Dish name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <textarea
                placeholder="Short description"
                value={draft.description}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                className="min-h-[88px] w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Category"
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <input
                  type="text"
                  placeholder="$7.50"
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <input
                type="text"
                placeholder="Image URL"
                value={draft.image}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, image: event.target.value }))
                }
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: event.target.value as MenuDraft["status"],
                  }))
                }
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="available">Available</option>
                <option value="sold_out">Sold Out</option>
                <option value="time_based">Time Based</option>
              </select>

              <Button
                type="button"
                variant="cta"
                className="w-full rounded-2xl"
                onClick={handleSaveItem}
              >
                {editingItemId ? "Save changes" : "Add menu item"}
              </Button>
            </div>
          </motion.section>
        )}

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-2xl border border-input bg-background pl-10 pr-4 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="mt-4 space-y-3">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-3xl border border-border p-3"
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusColor[item.status ?? "available"]}`}
                    >
                      {statusLabel[item.status ?? "available"]}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                    {item.description || "No description added yet."}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-primary">
                      {item.price}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditComposer(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary transition-transform hover:scale-105 active:scale-95"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMenuItem(item.id ?? "")}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-transform hover:scale-105 active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border px-5 py-10 text-center">
              <p className="text-sm font-semibold text-foreground">
                No menu items matched your search
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Adjust the search or add a new dish for customers to browse.
              </p>
            </div>
          )}
        </div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantMenuPage;
