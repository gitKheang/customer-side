import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  Camera,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  CircleHelp,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest, logout, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || "Guest");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Guest mode restriction
  if (isGuest && !isAuthenticated) {
    return (
      <div className="relative flex h-full flex-col bg-background">
        <div className="safe-area-top" />
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <User className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-lg font-bold text-foreground">
            Sign in to view profile
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create an account to manage your profile, favorites, and booking
            history.
          </p>
          <Button
            variant="cta"
            size="lg"
            className="w-full mt-6"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full mt-3"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const menuItems = [
    {
      icon: Heart,
      label: "Favorite Restaurants",
      action: () => navigate("/favorites"),
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => navigate("/notifications"),
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      action: () => navigate("/privacy-security"),
    },
    {
      icon: CircleHelp,
      label: "Help & Support",
      action: () => navigate("/help-support"),
    },
  ];

  const handleSave = () => {
    const result = updateProfile({ name, email, phone });
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage("");
    setEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateProfile({ photo: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Manage your account
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center px-5 py-5"
        >
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-primary/10 overflow-hidden">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2.5 shadow-lg shadow-primary/30 active:scale-90 transition-transform"
            >
              <Camera className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </motion.div>

        {/* Edit Form */}
        <div className="px-5 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border p-4 space-y-4"
          >
            <div>
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editing}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>

            {editing ? (
              <>
                <Button
                  variant="cta"
                  size="default"
                  className="w-full"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                {errorMessage ? (
                  <p className="text-xs font-medium text-destructive">
                    {errorMessage}
                  </p>
                ) : null}
              </>
            ) : (
              <Button
                variant="outline"
                size="default"
                className="w-full"
                onClick={() => {
                  setErrorMessage("");
                  setEditing(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </motion.div>

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border overflow-hidden"
          >
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-sm text-foreground border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors active:bg-secondary"
              >
                <div className="rounded-lg bg-secondary p-2">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 text-left text-sm font-medium">
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/15 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors active:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
