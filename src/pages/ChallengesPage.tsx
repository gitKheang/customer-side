import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const challenges = [
  { icon: "🥗", title: "Log all meals", points: 50, color: "bg-success/10" },
  { icon: "🚶", title: "Walk 5,000 steps", points: 75, color: "bg-primary/10" },
  { icon: "✨", title: "Complete AI quiz", points: 100, color: "bg-warning/10" },
];

const ChallengesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-background safe-area-top px-6">
      <div className="mt-4 mb-2 flex gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Earn while you eat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Log meals, hit daily goals, and complete challenges to collect points and rewards!
        </p>

        <h2 className="mt-7 text-base font-bold text-foreground">Challenges</h2>

        <div className="mt-3.5 space-y-3">
          {challenges.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="flex items-center gap-3.5 rounded-2xl bg-secondary/50 p-4 border border-border/50"
            >
              <div className={`rounded-xl ${c.color} p-2.5`}>
                <span className="text-xl">{c.icon}</span>
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{c.title}</span>
              <span className="text-sm font-bold text-primary">+{c.points} pts</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto mb-10 flex items-center gap-3">
          <Button variant="cta" size="lg" className="flex-1" onClick={() => navigate("/home")}>
            Continue
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/home")} className="text-muted-foreground">
            Skip for Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengesPage;
