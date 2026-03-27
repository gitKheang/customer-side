import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Eye,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  UtensilsCrossed,
  X,
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
  available: "Available",
  sold_out: "Sold out",
  time_based: "Time based",
};

const statusColor: Record<
  NonNullable<RestaurantMenuItem["status"]>,
  string
> = {
  available: "bg-success/10 text-success",
  sold_out: "bg-destructive/10 text-destructive",
  time_based: "bg-primary/10 text-primary",
};

const statusOptions: {
  value: NonNullable<RestaurantMenuItem["status"]>;
  label: string;
  activeBg: string;
  activeText: string;
}[] = [
  {
    value: "available",
    label: "Available",
    activeBg: "bg-success text-white",
    activeText: "text-success",
  },
  {
    value: "sold_out",
    label: "Sold Out",
    activeBg: "bg-destructive text-white",
    activeText: "text-destructive",
  },
  {
    value: "time_based",
    label: "Time Based",
    activeBg: "bg-primary text-white",
    activeText: "text-primary",
  },
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { managedRestaurant, addMenuItem, updateMenuItem, removeMenuItem } =
    useRestaurantData();
  const [search, setSearch] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MenuDraft>(emptyDraft);
  const [menuError, setMenuError] = useState("");

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
    setMenuError("");
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
    setMenuError("");
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingItemId(null);
    setDraft(emptyDraft);
    setMenuError("");
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    event.target.value = "";
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

    if (!payload.name) {
      setMenuError("Dish name is required");
      return;
    }
    if (!payload.price || payload.price === "$") {
      setMenuError("A valid price is required (e.g. $7.50)");
      return;
    }
    setMenuError("");

    if (editingItemId) {
      updateMenuItem(editingItemId, payload);
    } else {
      addMenuItem(payload);
    }

    closeComposer();
  };

  const previewImage = draft.image || defaultMenuImage;

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
        {/* Summary card */}
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

        {/* Search */}
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

        {/* Menu items list */}
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

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Full-screen composer overlay */}
      <AnimatePresence>
        {isComposerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute inset-0 z-50 flex flex-col bg-background"
          >
            <div className="safe-area-top" />

            {/* Header */}
            <div className="flex items-center gap-3 px-5 pb-3">
              <button
                type="button"
                onClick={closeComposer}
                className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-foreground">
                  {editingItemId ? "Edit Dish" : "Add New Dish"}
                </h1>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {editingItemId
                    ? "Update this dish on your public menu"
                    : "This dish will appear on your customer-facing menu"}
                </p>
              </div>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-hide">
              {/* Image upload area */}
              {draft.image ? (
                /* Has image — show preview with overlay actions */
                <div className="relative overflow-hidden rounded-3xl border border-border">
                  <div className="relative h-52">
                    <img
                      src={draft.image}
                      alt="Food preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all active:scale-[0.97]"
                        >
                          <Upload className="h-4 w-4 text-primary" />
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, image: "" }))
                          }
                          className="flex items-center justify-center rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-sm transition-all active:scale-[0.97]"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No image — clean empty state, no background image */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-52 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/30 transition-colors hover:bg-secondary/50 active:bg-secondary/60"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Add a photo of this dish
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Tap to upload from your device
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                    <ImagePlus className="h-3.5 w-3.5" />
                    Choose Photo
                  </span>
                </button>
              )}

              {/* Form fields */}
              <div className="mt-5 space-y-4">
                {/* Dish name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fish Amok"
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">
                    Description
                  </label>
                  <textarea
                    placeholder="Briefly describe the dish, ingredients, or style"
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
                  />
                </div>

                {/* Category + Price row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main, Starter"
                      value={draft.category}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          category: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
                      Price
                    </label>
                    <input
                      type="text"
                      placeholder="$7.50"
                      value={draft.price}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>

                {/* Status pills */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-foreground">
                    Availability
                  </label>
                  <div className="flex gap-2">
                    {statusOptions.map((opt) => {
                      const isActive = draft.status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              status: opt.value,
                            }))
                          }
                          className={`flex-1 rounded-2xl border py-3 text-xs font-semibold transition-all active:scale-[0.97] ${
                            isActive
                              ? `${opt.activeBg} border-transparent shadow-sm`
                              : "border-border bg-background text-muted-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                {menuError && (
                  <div className="rounded-2xl bg-destructive/5 px-4 py-3">
                    <p className="text-xs font-medium text-destructive">
                      {menuError}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky bottom action */}
            <div className="border-t border-border bg-background px-5 pb-8 pt-4">
              <Button
                type="button"
                variant="cta"
                size="lg"
                className="w-full rounded-2xl"
                onClick={handleSaveItem}
              >
                {editingItemId ? "Save Changes" : "Add to Menu"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isComposerOpen && <RestaurantBottomNav />}
    </div>
  );
};

export default RestaurantMenuPage;
