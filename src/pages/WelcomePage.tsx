import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-restaurant.jpg";
import { Utensils, CalendarDays, Clock } from "lucide-react";

const slides = [
  {
    title: "Book Your Table\nInstantly",
    subtitle: "Find restaurants, check real-time availability, and lock in your spot instantly.",
    icon: Utensils,
  },
  {
    title: "Discover Amazing\nRestaurants",
    subtitle: "Browse curated restaurants near you with reviews, menus, and photos.",
    icon: CalendarDays,
  },
  {
    title: "Never Wait\nIn Line Again",
    subtitle: "Reserve your table in seconds and arrive to a seat ready for you.",
    icon: Clock,
  },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="relative h-[55%] overflow-hidden">
        <img src={heroImage} alt="Restaurant" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute bottom-16 left-8 right-8 flex justify-center gap-3">
          {[Utensils, CalendarDays, Clock].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`rounded-2xl p-3 shadow-lg ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : i === 1
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-warning text-warning-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-between px-8 pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold leading-tight text-foreground whitespace-pre-line">
              {slides[current].title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {slides[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 my-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button variant="cta" size="lg" className="w-full" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/home")}>
            Skip now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
