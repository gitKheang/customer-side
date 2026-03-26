import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const RestaurantEditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || "Phorn Sinet",
    email: user?.email || "sinet@gmail.com",
    phone: user?.phone || "+855 12 888 001",
  });

  const handleSave = () => {
    updateProfile({ name: form.fullName, email: form.email, phone: form.phone });
    toast.success("Profile updated!");
    navigate(-1);
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goBackOr(navigate, "/restaurant-profile")}
            className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Edit Profile</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs font-semibold text-primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center py-5"
        >
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary/5 text-3xl font-bold text-primary ring-4 ring-primary/10">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                form.fullName[0]?.toUpperCase() || "U"
              )}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2.5 shadow-lg shadow-primary/30 transition-transform active:scale-90"
            >
              <Camera className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 rounded-2xl border border-border p-4"
        >
          <div>
            <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              Full Name
            </label>
            <Input
              type="text"
              value={form.fullName}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullName: e.target.value }))
              }
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              Phone Number
            </label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
        </motion.div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantEditProfilePage;
