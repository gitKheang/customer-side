import BottomNav from "@/components/BottomNav";

const OrdersPage = () => {
  const orders = [
    { id: 1, restaurant: "Romeo Lane", items: "Truffle Pasta x1, Caesar Salad x1", total: "$44", status: "Preparing", time: "25 min" },
    { id: 2, restaurant: "Sakura Sushi Bar", items: "Dragon Roll x2, Miso Soup x1", total: "$42", status: "Delivered", time: "Completed" },
    { id: 3, restaurant: "Bella Trattoria", items: "Margherita Pizza x1", total: "$15", status: "Delivered", time: "Completed" },
  ];

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />
      <div className="px-5 pb-3">
        <h1 className="text-xl font-bold text-foreground">Orders</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground text-sm">{o.restaurant}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.items}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                o.status === "Preparing" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
              }`}>
                {o.status}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-xs text-muted-foreground">{o.time}</span>
              <span className="text-sm font-bold text-foreground">{o.total}</span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
