import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { goBackOr } from "@/lib/navigation";
import { isValidIdentifier } from "@/lib/authValidation";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");

  const handleVerifyEmail = () => {
    if (!isValidIdentifier(identifier)) {
      toast.error("Please enter a valid email or phone number");
      return;
    }
    setStep("reset");
  };

  const handleReset = () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const result = resetPassword(identifier, newPassword);
    if (result.success) {
      toast.success(result.message);
      navigate("/signin");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background safe-area-top">
      <div className="px-5">
        <button
          onClick={() =>
            step === "reset" ? setStep("email") : goBackOr(navigate, "/signin")
          }
          className="mb-5 mt-3 self-start p-2 rounded-full hover:bg-secondary transition-colors active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col items-center px-5"
      >
        <div className="mb-5 rounded-2xl bg-primary/10 p-4">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground leading-relaxed">
          {step === "email"
            ? "Enter your email or phone to reset your password"
            : "Enter your new password"}
        </p>

        <div className="mt-8 w-full space-y-3.5">
          {step === "email" ? (
            <>
              <Input
                type="text"
                inputMode="email"
                placeholder="Enter your email or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/50 px-5 text-center focus:ring-1 focus:ring-primary/20"
              />
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                disabled={!isValidIdentifier(identifier)}
                onClick={handleVerifyEmail}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Input
                type="password"
                placeholder="New password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/50 px-5 text-center focus:ring-1 focus:ring-primary/20"
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/50 px-5 text-center focus:ring-1 focus:ring-primary/20"
              />
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                disabled={!newPassword || !confirmPassword}
                onClick={handleReset}
              >
                Reset Password
              </Button>
            </>
          )}
        </div>

        <p className="mt-auto mb-8 text-sm text-muted-foreground">
          Remember your password?{" "}
          <button
            className="font-semibold text-primary"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
