import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const RestaurantPrivacyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { managedRestaurant } = useRestaurantData();

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-2">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/restaurant-settings")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Privacy & Security
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Owner account and restaurant data controls
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <div className="mt-2 overflow-hidden rounded-2xl border border-border">
          <div className="flex items-start gap-3 border-b border-border px-4 py-3">
            <div className="rounded-lg bg-secondary p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Account email</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {user?.email || "owner@restaurant.app"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-b border-border px-4 py-3">
            <div className="rounded-lg bg-secondary p-2">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Restaurant access</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                Owner tools enabled for {managedRestaurant.name}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Dashboard, bookings, tables, and menu changes are tied to this
                account.
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
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Reset your password if you suspect unauthorized access to the
                    restaurant account.
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

        <div className="mt-4 rounded-2xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary p-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Data handling
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Reservation details, customer reviews, and restaurant profile
                information are stored to operate your merchant tools and notify
                you about important account activity.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border p-4">
          <p className="text-xs font-semibold text-foreground">Security note</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            If the restaurant changes ownership or team access needs to be
            transferred, update your owner profile and contact support before
            sharing login credentials.
          </p>
        </div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantPrivacyPage;
