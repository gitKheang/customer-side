import { useNavigate, useParams } from "react-router-dom";
import { mockRestaurants } from "@/data/mockData";
import { ArrowLeft, Heart, Star, Clock, MapPin, Info, Navigation, QrCode, Truck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = mockRestaurants.find((r) => r.id === id);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  if (!restaurant) return <div className="flex h-full items-center justify-center text-foreground">Not found</div>;

  const orderOptions = [
    { icon: QrCode, title: "Order at table", subtitle: "Scan QR order with ease", color: "bg-primary/10" },
    { icon: Truck, title: "Order for Delivery", subtitle: "Order to your door", color: "bg-destructive/10" },
    { icon: ShoppingBag, title: "Order for collection", subtitle: "Order now & collect", color: "bg-warning/10" },
  ];

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Hero */}
      <div className="relative h-[42%]">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        <div className="absolute top-0 left-0 right-0 safe-area-top flex items-center justify-between px-5 pt-2">
          <button onClick={() => navigate(-1)} className="rounded-full bg-background/20 backdrop-blur-sm p-2.5">
            <ArrowLeft className="h-5 w-5 text-background" />
          </button>
          <button onClick={() => setIsFav(!isFav)} className="rounded-full bg-background/20 backdrop-blur-sm p-2.5">
            <Heart className={`h-5 w-5 ${isFav ? "fill-destructive text-destructive" : "text-background"}`} />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-2xl font-bold text-background">{restaurant.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-background/80">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success" />
              Open now
            </span>
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>{restaurant.rating} ({restaurant.reviewCount > 1000 ? `${(restaurant.reviewCount / 1000).toFixed(0)}k` : restaurant.reviewCount} Reviews)</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex items-center gap-1.5 rounded-full bg-background/20 backdrop-blur-sm px-4 py-2 text-xs font-medium text-background">
              <Info className="h-3.5 w-3.5" /> More info
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground">
              <Navigation className="h-3.5 w-3.5" /> Get Direction
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-5 space-y-5">
          {/* Order options */}
          <div className="space-y-2">
            {orderOptions.map((opt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-2xl border border-border p-4"
              >
                <div className={`rounded-xl ${opt.color} p-2.5`}>
                  <opt.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Available Slots */}
          <div>
            <h3 className="text-base font-bold text-foreground">Available slots for today</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {restaurant.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    selectedSlot === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-6">
            <Button variant="outline" size="lg" className="flex-1">
              Food Menu
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="flex-1"
              onClick={() => navigate(`/book/${restaurant.id}`)}
            >
              Book a Table
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
