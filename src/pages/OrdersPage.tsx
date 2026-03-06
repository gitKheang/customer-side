import { mockRestaurants } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2 } from "lucide-react";

const orders = [
  {
    id: 1,
    restaurant: "Romeo Lane",
    restaurantImage: mockRestaurants[0].image,
    items: ["Truffle Pasta x1", "Caesar Salad x1"],
    total: "$44",
    status: "Preparing" as const,
    time: "~25 min",
    orderNumber: "#2847",
  },
  {
    id: 2,
    restaurant: "Sakura Sushi Bar",
    restaurantImage: mockRestaurants[1].image,
    items: ["Dragon Roll x2", "Miso Soup x1"],
    total: "$42",
    status: "Delivered" as const,
    time: "Completed",
    orderNumber: "#2831",
  },
  {
    id: 3,
    restaurant: "Bella Trattoria",
    restaurantImage: mockRestaurants[2].image,
    items: ["Margherita Pizza x1"],
    total: "$15",
    status: "Delivered" as const,
    time: "Completed",
    orderNumber: "#2819",
  },
];

const OrdersPage = () => {
  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />
      <div className="px-5 pb-4">
        <h1 className="text-lg font-bold text-foreground">Orders</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">Track your food orders</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide space-y-3">
        {orders.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border overflow-hidden card-shadow"
          >
            <div className="flex gap-3 p-3.5">
              <img src={o.restaurantImage} alt={o.restaurant} className="rounded-xl object-cover" style={{ width: 72, height: 72 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{o.restaurant}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{o.orderNumber}</p>
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    o.status === "Preparing"
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                  }`}>
                    {o.status === "Preparing" ? <Package className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                    {o.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 truncate">{o.items.join(", ")}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-3.5 py-2.5 bg-secondary/30">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {o.time}
              </span>
              <span className="text-sm font-bold text-foreground">{o.total}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
