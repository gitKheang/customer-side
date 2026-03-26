import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

interface Address {
  id: string;
  label: string;
  address: string;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Main Branch",
    address: "No. 136, Street 41, BKK1, Phnom Penh",
  },
  {
    id: "2",
    label: "Warehouse",
    address: "No. 22, Street 288, Toul Kork, Phnom Penh",
  },
];

const RestaurantAddressesPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim() || !newAddress.trim()) return;
    setAddresses((prev) => [
      ...prev,
      { id: Date.now().toString(), label: newLabel.trim(), address: newAddress.trim() },
    ]);
    setNewLabel("");
    setNewAddress("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-4">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/restaurant-settings")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Saved Addresses</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start gap-3 rounded-2xl border border-border p-4"
            >
              <div className="rounded-lg bg-secondary p-2">
                <MapPin className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {addr.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {addr.address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </motion.div>

        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3 rounded-2xl border border-border p-4"
          >
            <Input
              placeholder="Label (e.g. Main Branch)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="h-12 rounded-xl bg-secondary/50"
            />
            <Input
              placeholder="Full address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="h-12 rounded-xl bg-secondary/50"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="cta"
                className="flex-1"
                disabled={!newLabel.trim() || !newAddress.trim()}
                onClick={handleAdd}
              >
                Save
              </Button>
            </div>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            className="mt-4 w-full gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add new address
          </Button>
        )}
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantAddressesPage;
