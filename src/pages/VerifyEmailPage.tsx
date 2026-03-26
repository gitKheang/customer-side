import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { goBackOr } from "@/lib/navigation";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

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
    <div className="flex h-full flex-col bg-background safe-area-top">
      <div className="px-5">
        <button
          onClick={() => goBackOr(navigate, "/signup/customer")}
          className="mb-5 mt-3 self-start p-2 rounded-full hover:bg-secondary transition-colors active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center px-5"
      >
        <div className="mb-5 rounded-2xl bg-primary/10 p-4">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Verify account</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground leading-relaxed">
          We've sent a 4 digit code to{"\n"}your selected contact
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
              className="h-16 w-16 rounded-2xl border-2 border-border bg-secondary/30 text-center text-2xl font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          ))}
        </div>

        <Button
          variant="cta"
          size="lg"
          className="mt-10 w-full"
          disabled={otp.some((d) => !d)}
          onClick={() => navigate("/home")}
        >
          Confirm
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="mt-3 w-full"
          onClick={() => {
            setOtp(["", "", "", ""]);
            refs[0].current?.focus();
          }}
        >
          Resend code
        </Button>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
