import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Type,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

interface Story {
  id: string;
  image: string;
  caption: string;
  timeAdded: string;
}

const initialStories: Story[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop",
    caption: "Delicious Fried Chickens",
    timeAdded: "8:00 AM",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop",
    caption: "Delicious Fried Chickens",
    timeAdded: "8:00 AM",
  },
];

const RestaurantStoryPage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [showAdd, setShowAdd] = useState(false);
  const [caption, setCaption] = useState("");

  const handleDelete = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePublish = () => {
    if (!caption.trim()) return;
    const newStory: Story = {
      id: Date.now().toString(),
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop",
      caption: caption.trim(),
      timeAdded: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setStories((prev) => [newStory, ...prev]);
    setCaption("");
    setShowAdd(false);
  };

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goBackOr(navigate, "/restaurant-dashboard")}
            className="rounded-full p-2 transition-colors hover:bg-secondary active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Story Management
            </h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Share updates with customers
            </p>
          </div>
        </div>
        <Button
          variant="cta"
          size="sm"
          className="rounded-full"
          onClick={() => setShowAdd(!showAdd)}
        >
          New Story
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        {/* Total stories card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <ImageIcon className="h-5 w-5 text-purple-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[22px] font-bold text-foreground">
                {stories.length}
              </p>
              <p className="text-[11px] text-muted-foreground">Total Stories</p>
            </div>
          </div>
        </motion.div>

        {/* Add New Story */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-2xl border border-border p-4"
          >
            <h3 className="text-sm font-bold text-foreground">Add New Story</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Share a photo or video to promote your restaurant
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-5 transition-colors hover:bg-primary/10"
              >
                <ImageIcon className="h-6 w-6 text-primary" strokeWidth={1.8} />
                <span className="text-xs font-semibold text-foreground">
                  Upload Photo
                </span>
                <span className="text-[10px] text-muted-foreground">
                  JPG, PNG, WebP
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-5 transition-colors hover:bg-primary/10"
              >
                <Video className="h-6 w-6 text-primary" strokeWidth={1.8} />
                <span className="text-xs font-semibold text-foreground">
                  Upload Video
                </span>
                <span className="text-[10px] text-muted-foreground">
                  MP4, WebM (max 30s)
                </span>
              </button>
            </div>

            <div className="relative mt-3">
              <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Add a caption to your story..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-secondary/50 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <Button
              variant="cta"
              className="mt-3 w-full"
              onClick={handlePublish}
            >
              Publish Story
            </Button>
          </motion.div>
        )}

        {/* Your Stories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-2xl border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Your Stories</h3>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              {stories.length} items
            </p>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <img
                  src={story.image}
                  alt={story.caption}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">
                    Time Added: {story.timeAdded}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Caption: {story.caption}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(story.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-transform hover:scale-110 active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantStoryPage;
