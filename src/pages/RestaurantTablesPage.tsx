import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Clock, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

interface Table {
  id: string;
  number: number;
  seats: number;
  status: "available" | "occupied" | "booked";
  guestName?: string;
  guestCount?: number;
  arriveTime?: string;
}

const initialTables: Table[] = [
  { id: "1", number: 1, seats: 2, status: "available" },
  {
    id: "2",
    number: 2,
    seats: 4,
    status: "booked",
    guestName: "Sinet",
    guestCount: 4,
    arriveTime: "6:30 PM",
  },
];

const RestaurantTablesPage = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [showAdd, setShowAdd] = useState(false);
  const [newSeats, setNewSeats] = useState("2");

  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    booked: tables.filter((t) => t.status === "booked").length,
    guests: tables.reduce((sum, t) => sum + (t.guestCount || 0), 0),
  };

  const handleAddTable = () => {
    const nextNum = Math.max(...tables.map((t) => t.number), 0) + 1;
    setTables((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        number: nextNum,
        seats: parseInt(newSeats) || 2,
        status: "available",
      },
    ]);
    setNewSeats("2");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id: string, status: Table["status"]) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              guestName: status === "available" ? undefined : t.guestName,
              guestCount: status === "available" ? undefined : t.guestCount,
              arriveTime: status === "available" ? undefined : t.arriveTime,
            }
          : t
      )
    );
  };

  const statusBadge = (status: Table["status"]) => {
    const styles = {
      available: "border border-success/30 text-success",
      occupied: "border border-primary/30 text-primary",
      booked: "border border-destructive/30 text-destructive",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${styles[status]}`}
      >
        {status === "available" && <Check className="h-3 w-3" />}
        {status === "booked" && <Clock className="h-3 w-3" />}
        {status}
      </span>
    );
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-foreground">
          Tables Management
        </h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Manage seating and availability
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Summary cards */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl px-3 py-2.5" style={{ border: "1.5px solid hsl(47 70% 72%)" }}>
            <p className="text-[20px] font-bold" style={{ color: "hsl(47 80% 38%)" }}>
              {counts.available}
            </p>
            <p className="text-[11px] font-medium" style={{ color: "hsl(47 75% 42%)" }}>
              Available
            </p>
          </div>
          <div className="rounded-2xl px-3 py-2.5" style={{ border: "1.5px solid hsl(47 70% 72%)" }}>
            <p className="text-[20px] font-bold" style={{ color: "hsl(47 80% 38%)" }}>
              {counts.booked}
            </p>
            <p className="text-[11px] font-medium" style={{ color: "hsl(47 75% 42%)" }}>Booked</p>
          </div>
          <div className="rounded-2xl px-3 py-2.5" style={{ border: "1.5px solid hsl(47 70% 72%)" }}>
            <p className="text-[20px] font-bold" style={{ color: "hsl(47 80% 38%)" }}>
              {counts.guests}
            </p>
            <p className="text-[11px] font-medium" style={{ color: "hsl(47 75% 42%)" }}>Guests</p>
          </div>
        </div>

        {/* All Tables header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">All Tables</h2>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <Plus className="h-4 w-4" />
            Add New Table
          </button>
        </div>

        {/* Add table form */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-3 rounded-2xl border border-border p-4"
          >
            <p className="text-sm font-semibold text-foreground">
              Number of seats
            </p>
            <div className="mt-2 flex gap-3">
              <input
                type="number"
                min={1}
                value={newSeats}
                onChange={(e) => setNewSeats(e.target.value)}
                className="h-11 flex-1 rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none focus:ring-1 focus:ring-primary/20"
              />
              <Button variant="cta" size="sm" onClick={handleAddTable}>
                Add
              </Button>
            </div>
          </motion.div>
        )}

        {/* Table cards */}
        <div className="space-y-3">
          {tables.map((table, i) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border p-4 card-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Table {table.number}
                  </h3>
                  {statusBadge(table.status)}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(table.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-destructive/30 text-destructive transition-transform hover:scale-110 active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Booked details */}
              {table.status === "booked" && table.guestName && (
                <div className="mt-3 space-y-1 border-l-2 border-border pl-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Name: {table.guestName}
                    </p>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {table.guestCount} guests
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Arrive Time:
                    </p>
                    <span>{table.arriveTime}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-3">
                <p className="text-[11px] text-muted-foreground">
                  {table.seats} seats
                </p>
                <div className="flex flex-1 justify-end gap-2">
                  {table.status !== "available" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() =>
                        handleStatusChange(table.id, "available")
                      }
                    >
                      Mark as Available
                    </Button>
                  )}
                  {table.status !== "occupied" && (
                    <Button
                      variant="cta"
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() =>
                        handleStatusChange(table.id, "occupied")
                      }
                    >
                      Mark as Occupied
                    </Button>
                  )}
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

export default RestaurantTablesPage;
