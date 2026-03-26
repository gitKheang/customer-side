import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: "available" | "sold_out" | "time_based";
}

const initialMenu: MenuItem[] = [
  {
    id: "1",
    name: "Fish Amok",
    description: "Signature steamed fish curry in banana leaf with spice.",
    price: 7.5,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop",
    status: "available",
  },
  {
    id: "2",
    name: "Lok Lak",
    description: "Stir-fried marinated beef with Kampot pepper sauce",
    price: 6.5,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop",
    status: "available",
  },
  {
    id: "3",
    name: "Prahok Ktiss",
    description: "Creamy fermented fish dip with minced pork, served",
    price: 5.0,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
    status: "time_based",
  },
  {
    id: "4",
    name: "Num Banh Chok",
    description: "Traditional Khmer rice noodles with green fish curry.",
    price: 4.5,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop",
    status: "time_based",
  },
  {
    id: "5",
    name: "Beef Stew",
    description: "Slow-cooked Cambodian beef stew with vegetables.",
    price: 8.0,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop",
    status: "sold_out",
  },
];

const statusLabel: Record<MenuItem["status"], string> = {
  available: "available",
  sold_out: "sold out",
  time_based: "time based",
};

const statusColor: Record<MenuItem["status"], string> = {
  available: "bg-success/10 text-success",
  sold_out: "bg-destructive/10 text-destructive",
  time_based: "bg-primary/10 text-primary",
};

const RestaurantMenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>(initialMenu);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    status: "available" as MenuItem["status"],
  });

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    available: items.filter((i) => i.status === "available").length,
    sold_out: items.filter((i) => i.status === "sold_out").length,
    time_based: items.filter((i) => i.status === "time_based").length,
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
      status: newItem.status,
    };
    setItems((prev) => [item, ...prev]);
    setNewItem({ name: "", description: "", price: "", status: "available" });
    setShowAdd(false);
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center justify-between px-5 pb-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Menu</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Manage your menu items
          </p>
        </div>
        <Button
          variant="cta"
          size="sm"
          className="rounded-full"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? "Cancel" : "Add Item"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Add Item Form */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 rounded-2xl border border-border p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              New menu item
            </h3>
            <div className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, name: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none focus:ring-1 focus:ring-primary/20"
              />
              <input
                type="text"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, description: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none focus:ring-1 focus:ring-primary/20"
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, price: e.target.value }))
                  }
                  className="h-11 flex-1 rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none focus:ring-1 focus:ring-primary/20"
                />
                <select
                  value={newItem.status}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      status: e.target.value as MenuItem["status"],
                    }))
                  }
                  className="h-11 flex-1 rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="time_based">Time Based</option>
                </select>
              </div>
              <Button variant="cta" className="w-full" onClick={handleAdd}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-border bg-secondary/50 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Status summary */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-emerald-50 px-3 py-2.5">
            <p className="text-[20px] font-bold text-emerald-600">
              {counts.available}
            </p>
            <p className="text-[11px] font-medium text-emerald-600">
              Available
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 px-3 py-2.5">
            <p className="text-[20px] font-bold text-red-600">
              {counts.sold_out}
            </p>
            <p className="text-[11px] font-medium text-red-600">Sold Out</p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-3 py-2.5">
            <p className="text-[20px] font-bold text-primary">
              {counts.time_based}
            </p>
            <p className="text-[11px] font-medium text-primary">Time-Based</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border p-3 card-shadow"
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusColor[item.status]}`}
                    >
                      {statusLabel[item.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-destructive">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary transition-transform hover:scale-110 active:scale-95"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-transform hover:scale-110 active:scale-95"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantMenuPage;
