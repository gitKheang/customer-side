import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-restaurant.jpg";
import { useAuth } from "@/contexts/AuthContext";

const slides = [
  {
    title: "Book Your Table\nInstantly",
    subtitle:
      "Find restaurants, check real-time availability, and lock in your spot instantly.",
  },
  {
    title: "Discover Amazing\nRestaurants",
    subtitle:
      "Browse curated restaurants near you with reviews, menus, and photos.",
  },
  {
    title: "Never Wait\nIn Line Again",
    subtitle:
      "Reserve your table in seconds and arrive to a seat ready for you.",
  },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const { guestLogin } = useAuth();
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="relative h-[55%] overflow-hidden">
        <img
          src={heroImage}
          alt="Restaurant"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-between px-5 pb-10 pt-8">
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
          <Button
            variant="cta"
            size="lg"
            className="w-full"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/signin")}
          >
            Log in
          </Button>
          <button
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => {
              guestLogin();
              navigate("/home");
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
