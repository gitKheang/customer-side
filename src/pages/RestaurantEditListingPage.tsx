import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Eye,
  ImagePlus,
  MapPin,
  Plus,
  Save,
  Sparkles,
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

const toSlotLabel = (value: string) => {
  const [rawHours, minutes] = value.split(":");
  const hours = Number(rawHours);
  if (Number.isNaN(hours) || !minutes) return value;

  const period = hours >= 12 ? "pm" : "am";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes}${period}`;
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
    tags: toCommaSeparated(managedRestaurant.tags),
    availableSlots: managedRestaurant.availableSlots,
    type: managedRestaurant.type,
    priceRange: managedRestaurant.priceRange,
    image: managedRestaurant.image,
  });
  const [slotDraft, setSlotDraft] = useState("");

  useEffect(() => {
    setForm({
      name: managedRestaurant.name,
      cuisine: managedRestaurant.cuisine,
      description: managedRestaurant.description,
      address: managedRestaurant.address,
      openUntil: managedRestaurant.openUntil,
      tags: toCommaSeparated(managedRestaurant.tags),
      availableSlots: managedRestaurant.availableSlots,
      type: managedRestaurant.type,
      priceRange: managedRestaurant.priceRange,
      image: managedRestaurant.image,
    });
    setSlotDraft("");
  }, [managedRestaurant]);

  const handleSave = () => {
    updateManagedRestaurant({
      name: form.name.trim() || managedRestaurant.name,
      cuisine: form.cuisine.trim() || managedRestaurant.cuisine,
      description: form.description.trim() || managedRestaurant.description,
      address: form.address.trim() || managedRestaurant.address,
      openUntil: form.openUntil.trim() || managedRestaurant.openUntil,
      image: form.image,
      type: form.type,
      priceRange: form.priceRange,
      tags: parseCommaSeparated(form.tags),
      availableSlots: sortSlots(form.availableSlots),
    });
    setSaved(true);
    setTimeout(() => navigate("/restaurant-dashboard"), 800);
  };

  const handleAddSlot = () => {
    const normalizedSlot = toSlotLabel(slotDraft);
    if (!slotDraft || form.availableSlots.includes(normalizedSlot)) {
      setSlotDraft("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      availableSlots: sortSlots([...prev.availableSlots, normalizedSlot]),
    }));
    setSlotDraft("");
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((slot) => slot !== slotToRemove),
    }));
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

      <div className="flex items-center justify-between gap-3 px-5 pb-3">
        <div className="flex items-center gap-3">
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

        <Button
          variant="ghost"
          size="sm"
          className={`text-xs font-semibold ${saved ? "text-success" : "text-primary"}`}
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? "Saved!" : "Save"}
        </Button>
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
            <div className="rounded-2xl bg-white/70 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    This is what customers see
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Search results, restaurant detail, booking checkout, and
                    saved favorites all read from this listing.
                  </p>
                </div>
              </div>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground">
                  Venue type
                </label>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      type: event.target.value as typeof prev.type,
                    }))
                  }
                  className="mt-1.5 h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="pub">Pub</option>
                  <option value="cafe">Cafe</option>
                  <option value="nightclub">Night club</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground">
                  Price range
                </label>
                <select
                  value={form.priceRange}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      priceRange: event.target.value,
                    }))
                  }
                  className="mt-1.5 h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                  <option value="$$$$">$$$$</option>
                </select>
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
              <Input
                value={form.openUntil}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    openUntil: event.target.value,
                  }))
                }
                className="mt-1.5 h-11 rounded-2xl"
                placeholder="10:00pm"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                Bookable time slots
              </label>
              <div className="mt-1.5 rounded-2xl border border-input bg-background p-3">
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      value={slotDraft}
                      onChange={(event) => setSlotDraft(event.target.value)}
                      className="h-11 rounded-2xl pl-9"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="cta"
                    className="h-11 rounded-2xl px-4"
                    onClick={handleAddSlot}
                    disabled={!slotDraft}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  Add one slot at a time. Customers will see these as the
                  available booking times on your listing.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {form.availableSlots.length > 0 ? (
                    form.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleRemoveSlot(slot)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary/12"
                      >
                        {slot}
                        <X className="h-3.5 w-3.5 text-primary" />
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                      No slots added yet
                    </div>
                  )}
                </div>
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
