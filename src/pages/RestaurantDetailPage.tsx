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
      <div className="relative h-[40%] min-h-[320px]">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

        <div className="absolute top-0 left-0 right-0 safe-area-top flex items-center justify-between px-5 pt-1">
          <button onClick={() => navigate(-1)} className="rounded-full bg-background/15 backdrop-blur-md p-2.5 active:scale-90 transition-transform">
            <ArrowLeft className="h-5 w-5 text-background" />
          </button>
          <button onClick={() => setIsFav(!isFav)} className="rounded-full bg-background/15 backdrop-blur-md p-2.5 active:scale-90 transition-transform">
            <Heart className={`h-5 w-5 transition-all ${isFav ? "fill-destructive text-destructive scale-110" : "text-background"}`} />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-2xl font-bold text-background leading-tight">{restaurant.name}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-background/80">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Open now
            </span>
            <span className="text-background/40">•</span>
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>{restaurant.rating} ({restaurant.reviewCount > 1000 ? `${(restaurant.reviewCount / 1000).toFixed(0)}k` : restaurant.reviewCount} Reviews)</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex items-center gap-1.5 rounded-full bg-background/15 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-background active:scale-95 transition-transform">
              <Info className="h-3.5 w-3.5" /> More info
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2.5 text-xs font-semibold text-foreground active:scale-95 transition-transform">
              <Navigation className="h-3.5 w-3.5" /> Get Direction
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mt-2">
        <div className="rounded-t-3xl bg-background pt-6 px-5 pb-5 space-y-5">
          {/* Description */}
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">{restaurant.description}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span>{restaurant.address}</span>
              <span className="text-border">•</span>
              <Clock className="h-3 w-3 text-primary" />
              <span>Open until {restaurant.openUntil}</span>
            </div>
          </div>

          {/* Order options */}
          <div className="space-y-2.5">
            {orderOptions.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex w-full items-center gap-4 rounded-2xl border border-border p-4 hover:border-primary/20 hover:bg-secondary/30 transition-all active:scale-[0.98]"
              >
                <div className={`rounded-xl ${opt.color} p-3`}>
                  <opt.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.subtitle}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Available Slots */}
          <div>
            <h3 className="text-sm font-bold text-foreground">Available slots for today</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {restaurant.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                    selectedSlot === slot
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-border text-foreground hover:border-primary/30"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1 pb-4">
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
