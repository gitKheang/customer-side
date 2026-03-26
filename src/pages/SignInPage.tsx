import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { goBackOr } from "@/lib/navigation";
import { isValidIdentifier } from "@/lib/authValidation";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login, socialAuth } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const canSignIn = isValidIdentifier(identifier) && !!password;

  const handleSocialSignIn = (provider: "google" | "apple") => {
    const result = socialAuth(provider, "customer");
    if (result.success) {
      navigate("/home");
    }
  };

  return (
    <div className="flex h-full flex-col bg-background safe-area-top">
      <div className="px-5">
        <button
          onClick={() => goBackOr(navigate, "/")}
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
          <LogIn className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground leading-relaxed">
          Sign in to continue to your dining{"\n"}or restaurant owner account
        </p>

        <div className="mt-8 w-full space-y-3.5">
          <Input
            type="text"
            inputMode="email"
            placeholder="Enter your email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="h-14 rounded-2xl bg-secondary/50 px-5 text-center focus:ring-1 focus:ring-primary/20"
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl bg-secondary/50 px-5 text-center focus:ring-1 focus:ring-primary/20"
          />

          <Button
            variant="cta"
            size="lg"
            className="w-full"
            disabled={!canSignIn}
            onClick={() => {
              const result = login(identifier, password);
              if (result.success) {
                navigate(
                  result.role === "restaurant" ? "/restaurant-dashboard" : "/home",
                );
              }
            }}
          >
            Sign in
          </Button>

          <button
            className="text-xs font-medium text-primary self-center"
            onClick={() => navigate("/reset-password")}
          >
            Forgot password?
          </button>
        </div>

        <div className="my-7 flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground font-medium">Or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="w-full space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-3"
            onClick={() => handleSocialSignIn("google")}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-3"
            onClick={() => handleSocialSignIn("apple")}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Sign in with Apple
          </Button>
        </div>

        <p className="mt-auto mb-8 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            className="font-semibold text-primary"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignInPage;
