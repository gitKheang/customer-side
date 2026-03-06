import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Footprints, Salad } from "lucide-react";

const challenges = [
  { icon: "🥗", title: "Log all meals", points: 50 },
  { icon: "🚶", title: "Walk 5,000 steps", points: 75 },
  { icon: "✨", title: "Complete AI quiz", points: 100 },
];

const ChallengesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-background safe-area-top px-6">
      <div className="mt-4 mb-2 flex gap-2">
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-primary" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <h1 className="mt-6 text-3xl font-bold text-foreground">
          Earn while you eat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Log meals, hit daily goals, and complete challenges to collect points and rewards!
        </p>

        <h2 className="mt-8 text-lg font-bold text-foreground">Challenges</h2>

        <div className="mt-4 space-y-3">
          {challenges.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4"
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="flex-1 text-sm font-medium text-foreground">{c.title}</span>
              <span className="text-sm font-bold text-primary">+{c.points} Points</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto mb-8 flex items-center gap-4">
          <Button variant="cta" size="lg" className="flex-1" onClick={() => navigate("/home")}>
            Continue
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/home")}>
            Skip for Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengesPage;
