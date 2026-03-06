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
  },
  {
    title: "Discover Amazing\nRestaurants",
    subtitle: "Browse curated restaurants near you with reviews, menus, and photos.",
  },
  {
    title: "Never Wait\nIn Line Again",
    subtitle: "Reserve your table in seconds and arrive to a seat ready for you.",
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
        <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-4">
          {[
            { Icon: Utensils, bg: "bg-primary", shadow: "shadow-primary/30" },
            { Icon: CalendarDays, bg: "bg-destructive", shadow: "shadow-destructive/30" },
            { Icon: Clock, bg: "bg-warning", shadow: "shadow-warning/30" },
          ].map(({ Icon, bg, shadow }, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
              className={`rounded-2xl p-3.5 shadow-lg ${bg} ${shadow} text-background`}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-between px-8 pb-10 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <h1 className="text-[28px] font-bold leading-tight text-foreground whitespace-pre-line">
              {slides[current].title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              {slides[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 my-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-7 h-2 bg-primary" : "w-2 h-2 bg-border"
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
