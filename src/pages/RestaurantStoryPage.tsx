import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  ImagePlus,
  Store,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";
import RestaurantStoryViewer from "@/components/RestaurantStoryViewer";
import { useRestaurantData } from "@/contexts/RestaurantDataContext";
import { goBackOr } from "@/lib/navigation";
import { formatStoryAge, getRestaurantStoryGroups } from "@/lib/restaurantStories";

const RestaurantStoryPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { managedRestaurant, addStory, removeStory } = useRestaurantData();
  const [showComposer, setShowComposer] = useState(false);
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>(
    managedRestaurant.image,
  );
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);

  const stories = useMemo(
    () =>
      [...(managedRestaurant.stories ?? [])].sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      ),
    [managedRestaurant.stories],
  );
  const storyGroups = useMemo(
    () => getRestaurantStoryGroups([managedRestaurant]),
    [managedRestaurant],
  );

  const resetComposer = () => {
    setHeadline("");
    setCaption("");
    setSelectedImage(managedRestaurant.image);
    setShowComposer(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    const normalizedHeadline = headline.trim();
    const normalizedCaption = caption.trim();

    if (!normalizedHeadline || !normalizedCaption) {
      return;
    }

    addStory({
      image: selectedImage || managedRestaurant.image,
      headline: normalizedHeadline,
      caption: normalizedCaption,
      durationSeconds: 5,
    });
    resetComposer();
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        <div className="safe-area-top" />

        <div className="flex items-center justify-between px-5 pb-4">
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
                Stories
              </h1>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Share quick updates customers can view on your listing
              </p>
            </div>
          </div>

          <Button
            variant="cta"
            size="sm"
            className="rounded-full"
            onClick={() => setShowComposer((prev) => !prev)}
          >
            Add story
          </Button>
        </div>

        <div className="space-y-4 px-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-secondary p-3">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Live on customer side
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {managedRestaurant.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Stories added here appear in the customer home stories row and
                  on your public restaurant detail page.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-secondary/60 px-4 py-3">
                <p className="text-[22px] font-bold text-foreground">
                  {stories.length}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Active stories
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsStoryViewerOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50 active:bg-secondary"
              >
                <Eye className="h-4 w-4 text-primary" />
                Preview
              </button>
            </div>
          </motion.div>

          {showComposer && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Create story
                  </h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Add one short visual update for customers browsing your
                    restaurant.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetComposer}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Close story composer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-secondary/30">
                <img
                  src={selectedImage || managedRestaurant.image}
                  alt="Story preview"
                  className="h-40 w-full object-cover"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
                >
                  <Upload className="h-4 w-4 text-primary" />
                  Upload photo
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedImage(managedRestaurant.image)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50"
                >
                  <ImagePlus className="h-4 w-4 text-primary" />
                  Use cover
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">
                    Headline
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(event) => setHeadline(event.target.value)}
                    placeholder="Tonight's dinner service is open"
                    className="h-12 w-full rounded-2xl border border-border bg-secondary/40 px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">
                    Caption
                  </span>
                  <textarea
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    placeholder="Tell customers what is new today."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
                  />
                </label>
              </div>

              <Button
                variant="cta"
                className="mt-4 w-full"
                onClick={handlePublish}
                disabled={!headline.trim() || !caption.trim()}
              >
                Publish story
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-border p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Recent stories
                </h2>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Your newest story appears first for customers
                </p>
              </div>
            </div>

            {stories.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-secondary/50 px-4 py-5 text-center">
                <p className="text-sm font-semibold text-foreground">
                  No stories yet
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Add one quick update to highlight specials, events, or today&apos;s
                  availability.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.04 }}
                    className="flex items-center gap-3 rounded-2xl border border-border p-3"
                  >
                    <img
                      src={story.image}
                      alt={story.headline}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {story.headline}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                        {story.caption}
                      </p>
                      <p className="mt-1.5 text-[10px] font-medium text-muted-foreground">
                        Posted {formatStoryAge(story.postedAt)} ago
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStory(story.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-transform hover:scale-105 active:scale-95"
                      aria-label={`Delete ${story.headline}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <RestaurantStoryViewer
          groups={storyGroups}
          initialRestaurantId={managedRestaurant.id}
          open={isStoryViewerOpen && storyGroups.length > 0}
          onClose={() => setIsStoryViewerOpen(false)}
        />
      </main>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantStoryPage;
