import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) refs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background safe-area-top px-6">
      <button onClick={() => navigate(-1)} className="mb-8 mt-4 self-start p-1">
        <ArrowLeft className="h-6 w-6 text-foreground" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 rounded-2xl bg-primary/10 p-4">
          <CheckSquare className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          We've sent 4 digit code on{"\n"}Your Email
        </p>

        <div className="mt-10 flex gap-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-16 w-16 rounded-2xl border border-border bg-secondary/50 text-center text-2xl font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          ))}
        </div>

        <Button
          variant="cta"
          size="lg"
          className="mt-10 w-full"
          onClick={() => navigate("/dietary-preferences")}
        >
          Confirm
        </Button>

        <Button variant="outline" size="lg" className="mt-3 w-full">
          Resend code
        </Button>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
