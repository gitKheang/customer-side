import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  ImagePlus,
  MapPin,
  Plus,
  Save,
  Store,
  Tags,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { goBackOr } from "@/lib/navigation";

const toCommaSeparated = (items: string[]) => items.join(", ");

const parseCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toSlotLabel = (value: string): string => {
  const trimmed = value.trim().toLowerCase();

  // Native time-picker format: "14:30" → "2:30pm"
  const nativeMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (nativeMatch) {
    const hours = Number(nativeMatch[1]);
    const minutes = nativeMatch[2];
    const period = hours >= 12 ? "pm" : "am";
    const normalizedHours = hours % 12 || 12;
    return `${normalizedHours}:${minutes}${period}`;
  }

  // User-typed: "7:30pm", "7:30 pm", "730pm", "730 PM"
  const userMatch = trimmed.match(/^(\d{1,2}):?(\d{2})\s*(am|pm)$/i);
  if (userMatch) {
    let hours = Number(userMatch[1]);
    const minutes = userMatch[2];
    const period = userMatch[3].toLowerCase();
    if (hours > 12 || hours < 1) return trimmed;
    return `${hours}:${minutes}${period}`;
  }

  return trimmed;
};

const getSlotSortValue = (slot: string) => {
  const match = slot.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toLowerCase();

  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const sortSlots = (slots: string[]) =>
  [...slots].sort((a, b) => getSlotSortValue(a) - getSlotSortValue(b));

const RestaurantEditListingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { managedRestaurant, managedRestaurantId, updateManagedRestaurant } =
    useRestaurantData();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: managedRestaurant.name,
    cuisine: managedRestaurant.cuisine,
    description: managedRestaurant.description,
    address: managedRestaurant.address,
    openUntil: managedRestaurant.openUntil,
    isOpen: managedRestaurant.isOpen,
    tags: toCommaSeparated(managedRestaurant.tags),
    availableSlots: managedRestaurant.availableSlots,
    type: managedRestaurant.type,
    priceRange: managedRestaurant.priceRange,
    image: managedRestaurant.image,
  });
  const [slotHour, setSlotHour] = useState("12");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotPeriod, setSlotPeriod] = useState<"am" | "pm">("pm");

  // Parse existing openUntil into selectable parts
  const parseTime = (val: string) => {
    const m = val.match(/(\d{1,2}):(\d{2})(am|pm)/i);
    if (!m) return { hour: "10", minute: "00", period: "pm" as const };
    return { hour: m[1], minute: m[2], period: m[3].toLowerCase() as "am" | "pm" };
  };
  const openParsed = parseTime(form.openUntil);
  const [openHour, setOpenHour] = useState(openParsed.hour);
  const [openMinute, setOpenMinute] = useState(openParsed.minute);
  const [openPeriod, setOpenPeriod] = useState<"am" | "pm">(openParsed.period);

  useEffect(() => {
    setForm((prev) => ({ ...prev, openUntil: `${openHour}:${openMinute}${openPeriod}` }));
  }, [openHour, openMinute, openPeriod]);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const mins = ["00", "15", "30", "45"];

  useEffect(() => {
    setForm({
      name: managedRestaurant.name,
      cuisine: managedRestaurant.cuisine,
      description: managedRestaurant.description,
      address: managedRestaurant.address,
      openUntil: managedRestaurant.openUntil,
      isOpen: managedRestaurant.isOpen,
      tags: toCommaSeparated(managedRestaurant.tags),
      availableSlots: managedRestaurant.availableSlots,
      type: managedRestaurant.type,
      priceRange: managedRestaurant.priceRange,
      image: managedRestaurant.image,
    });
  }, [managedRestaurant]);

  const handleSave = () => {
    updateManagedRestaurant({
      name: form.name.trim() || managedRestaurant.name,
      cuisine: form.cuisine.trim() || managedRestaurant.cuisine,
      description: form.description.trim() || managedRestaurant.description,
      address: form.address.trim() || managedRestaurant.address,
      openUntil: form.openUntil.trim() || managedRestaurant.openUntil,
      isOpen: form.isOpen,
      image: form.image,
      type: form.type,
      priceRange: form.priceRange,
      tags: parseCommaSeparated(form.tags),
      availableSlots: sortSlots(form.availableSlots),
    });
    setSaved(true);
    setTimeout(() => navigate("/restaurant-dashboard"), 800);
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-3">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/restaurant-settings")}
          className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Restaurant Listing
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Update the profile customers browse and book
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <section className="overflow-hidden rounded-[28px] border border-[#e8d39d] bg-[linear-gradient(145deg,#fff7de_0%,#f8efcb_100%)]">
          <div className="relative h-44 overflow-hidden">
            <img
              src={form.image}
              alt={form.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f2414]/75 via-[#2f2414]/10 to-transparent" />
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5d4d1f] backdrop-blur">
                Customer-facing profile
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#2f2414] backdrop-blur transition-transform active:scale-90"
              >
                <ImagePlus className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
                Preview
              </p>
              <h2 className="mt-1 text-2xl font-bold leading-tight text-white">
                {form.name}
              </h2>
              <p className="mt-1 text-sm text-white/80">{form.address}</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />

          <div className="space-y-4 p-4">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "hsl(47 70% 94%)",
                border: "1.5px solid hsl(47 60% 78%)",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "hsl(47 80% 30%)" }}>
                This is what customers see
              </p>
              <p className="mt-1 text-xs leading-5" style={{ color: "hsl(47 50% 40%)" }}>
                Search results, restaurant detail, booking checkout, and
                saved favorites all read from this listing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => navigate(`/restaurant/${managedRestaurantId}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview page
              </Button>
              <Button
                type="button"
                variant="cta"
                className="rounded-2xl"
                onClick={() => navigate("/restaurant-menu")}
              >
                <UtensilsCrossed className="mr-2 h-4 w-4" />
                Manage menu
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-border p-4">
          <div className="flex items-center gap-2">
            <Store className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Basic details
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Restaurant name
              </label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="mt-1.5 h-11 rounded-2xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Cuisine line
              </label>
              <Input
                value={form.cuisine}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, cuisine: event.target.value }))
                }
                className="mt-1.5 h-11 rounded-2xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                className="mt-1.5 min-h-[110px] w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Venue type
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {(
                  [
                    { value: "restaurant", label: "Restaurant" },
                    { value: "pub", label: "Pub" },
                    { value: "cafe", label: "Cafe" },
                    { value: "nightclub", label: "Night club" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, type: option.value }))
                    }
                    className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                      form.type === option.value
                        ? "bg-primary text-white shadow-sm"
                        : "border border-input bg-background text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Price range
              </label>
              <div className="mt-1.5 flex gap-2">
                {(
                  [
                    { value: "$", label: "$" },
                    { value: "$$", label: "$$" },
                    { value: "$$$", label: "$$$" },
                    { value: "$$$$", label: "$$$$" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        priceRange: option.value,
                      }))
                    }
                    className={`flex-1 rounded-full py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                      form.priceRange === option.value
                        ? "bg-primary text-white shadow-sm"
                        : "border border-input bg-background text-foreground"
                    }`}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-border p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Booking details
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Address
              </label>
              <textarea
                value={form.address}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, address: event.target.value }))
                }
                className="mt-1.5 min-h-[88px] w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Open until
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {hours.map((h) => (
                    <button key={h} type="button" onClick={() => setOpenHour(h)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                        openHour === h ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                      }`}
                    >{h}</button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {mins.map((m) => (
                    <button key={m} type="button" onClick={() => setOpenMinute(m)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${
                        openMinute === m ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                      }`}
                    >:{m}</button>
                  ))}
                  <button type="button" onClick={() => setOpenPeriod("am")}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${
                      openPeriod === "am" ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                    }`}
                  >AM</button>
                  <button type="button" onClick={() => setOpenPeriod("pm")}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${
                      openPeriod === "pm" ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                    }`}
                  >PM</button>
                </div>
                <p className="text-[11px] font-medium text-foreground/60">
                  Selected: <span className="font-bold text-foreground">{openHour}:{openMinute}{openPeriod}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isOpen: true }))
                  }
                  className={`flex-1 rounded-full py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                    form.isOpen
                      ? "bg-success text-white shadow-sm"
                      : "border border-input bg-background text-foreground"
                  }`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isOpen: false }))
                  }
                  className={`flex-1 rounded-full py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                    !form.isOpen
                      ? "bg-destructive text-white shadow-sm"
                      : "border border-input bg-background text-foreground"
                  }`}
                >
                  Closed
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Bookable time slots
              </label>
              <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                Tap a slot to remove it
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {hours.map((h) => (
                    <button key={h} type="button" onClick={() => setSlotHour(h)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                        slotHour === h ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                      }`}
                    >{h}</button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {mins.map((m) => (
                    <button key={m} type="button" onClick={() => setSlotMinute(m)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${
                        slotMinute === m ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                      }`}
                    >:{m}</button>
                  ))}
                  <button type="button" onClick={() => setSlotPeriod("am")}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${
                      slotPeriod === "am" ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                    }`}
                  >AM</button>
                  <button type="button" onClick={() => setSlotPeriod("pm")}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${
                      slotPeriod === "pm" ? "bg-primary text-white shadow-sm" : "border border-input bg-background text-foreground"
                    }`}
                  >PM</button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-foreground/60">
                    Selected: <span className="font-bold text-foreground">{slotHour}:{slotMinute}{slotPeriod}</span>
                  </p>
                  <Button
                    type="button"
                    variant="cta"
                    className="h-9 rounded-xl px-4 text-xs"
                    onClick={() => {
                      const newSlot = `${slotHour}:${slotMinute}${slotPeriod}`;
                      if (!form.availableSlots.includes(newSlot)) {
                        setForm((prev) => ({
                          ...prev,
                          availableSlots: sortSlots([...prev.availableSlots, newSlot]),
                        }));
                      }
                    }}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add slot
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.availableSlots.length > 0 ? (
                  form.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          availableSlots: prev.availableSlots.filter((s) => s !== slot),
                        }))
                      }
                      className="group flex items-center justify-center gap-1 rounded-xl border border-primary/20 bg-primary/5 px-2 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-destructive/30 hover:bg-destructive/5 active:scale-95"
                    >
                      {slot}
                      <X className="h-3 w-3 text-primary/40 group-hover:text-destructive" />
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 rounded-xl border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                    No slots added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-border p-4">
          <div className="flex items-center gap-2">
            <Tags className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Discoverability
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Search tags
              </label>
              <textarea
                value={form.tags}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tags: event.target.value }))
                }
                className="mt-1.5 min-h-[88px] w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Khmer, BKK1, family dining"
              />
            </div>
          </div>
        </section>

        <Button
          type="button"
          variant="cta"
          size="lg"
          className="mt-5 w-full rounded-2xl"
          onClick={handleSave}
          disabled={saved}
        >
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved!" : "Save listing changes"}
        </Button>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantEditListingPage;
