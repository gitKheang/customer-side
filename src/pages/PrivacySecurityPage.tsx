import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { goBackOr } from "@/lib/navigation";

const PrivacySecurityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-2">
        <button
          onClick={() => goBackOr(navigate, "/profile")}
          className="rounded-full p-2 hover:bg-secondary transition-colors active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Privacy & Security</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Essentials for your account and reservation data
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-hide">
        <div className="mt-2 rounded-2xl border border-border overflow-hidden">
          <div className="flex items-start gap-3 px-4 py-3 border-b border-border">
            <div className="rounded-lg bg-secondary p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Account email</p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {user?.email || "Guest mode"}
              </p>
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-secondary p-2">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Password and sign in
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Reset your password if you think your account is compromised.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/reset-password")}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacySecurityPage;
