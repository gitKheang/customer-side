import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Camera, LogOut, ChevronRight, Shield, Bell, CircleHelp, Heart, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("William");
  const [email, setEmail] = useState("william@email.com");
  const [phone, setPhone] = useState("+44 7700 900000");
  const [editing, setEditing] = useState(false);

  const menuItems = [
    { icon: Heart, label: "Favorite Restaurants", action: () => navigate("/search") },
    { icon: UtensilsCrossed, label: "Dietary Preferences", action: () => navigate("/dietary-preferences") },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: Shield, label: "Privacy & Security", action: () => {} },
    { icon: CircleHelp, label: "Help & Support", action: () => {} },
  ];

  const handleSave = () => {
    setEditing(false);
    toast.success("Profile updated!");
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        <div className="px-5 pb-2">
          <h1 className="text-lg font-bold text-foreground">Profile</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage your account</p>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center px-5 py-5"
        >
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-primary/10">
              W
            </div>
            <button className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2.5 shadow-lg shadow-primary/30 active:scale-90 transition-transform">
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
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editing}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>

            {editing ? (
              <Button variant="cta" size="default" className="w-full" onClick={handleSave}>
                Save Changes
              </Button>
            ) : (
              <Button variant="outline" size="default" className="w-full" onClick={() => setEditing(true)}>
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
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => { toast.success("Logged out"); navigate("/"); }}
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
