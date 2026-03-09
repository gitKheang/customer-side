import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/data/mockData";
import {
  formatStoryAge,
  type RestaurantStoryGroup,
} from "@/lib/restaurantStories";

interface StoryPosition {
  groupIndex: number;
  storyIndex: number;
}

interface RestaurantStoryViewerProps {
  groups: RestaurantStoryGroup[];
  initialRestaurantId?: string;
  open: boolean;
  onClose: () => void;
  onRestaurantSeen?: (restaurant: Restaurant) => void;
  primaryActionLabel?: string;
  onPrimaryAction?: (restaurant: Restaurant) => void;
}

const getInitialPosition = (
  groups: RestaurantStoryGroup[],
  restaurantId?: string,
): StoryPosition => {
  if (!restaurantId) {
    return { groupIndex: 0, storyIndex: 0 };
  }

  const groupIndex = groups.findIndex(
    (group) => group.restaurant.id === restaurantId,
  );

  return {
    groupIndex: groupIndex >= 0 ? groupIndex : 0,
    storyIndex: 0,
  };
};

const getNextPosition = (
  position: StoryPosition,
  groups: RestaurantStoryGroup[],
): StoryPosition | null => {
  const currentGroup = groups[position.groupIndex];
  if (!currentGroup) return null;

  if (position.storyIndex < currentGroup.stories.length - 1) {
    return {
      groupIndex: position.groupIndex,
      storyIndex: position.storyIndex + 1,
    };
  }

  if (position.groupIndex < groups.length - 1) {
    return {
      groupIndex: position.groupIndex + 1,
      storyIndex: 0,
    };
  }

  return null;
};

const getPreviousPosition = (
  position: StoryPosition,
  groups: RestaurantStoryGroup[],
): StoryPosition | null => {
  const currentGroup = groups[position.groupIndex];
  if (!currentGroup) return null;

  if (position.storyIndex > 0) {
    return {
      groupIndex: position.groupIndex,
      storyIndex: position.storyIndex - 1,
    };
  }

  if (position.groupIndex > 0) {
    const previousGroup = groups[position.groupIndex - 1];
    return {
      groupIndex: position.groupIndex - 1,
      storyIndex: previousGroup.stories.length - 1,
    };
  }

  return null;
};

const RestaurantStoryViewer = ({
  groups,
  initialRestaurantId,
  open,
  onClose,
  onRestaurantSeen,
  primaryActionLabel = "View Restaurant",
  onPrimaryAction,
}: RestaurantStoryViewerProps) => {
  const [position, setPosition] = useState<StoryPosition>({ groupIndex: 0, storyIndex: 0 });

  useEffect(() => {
    if (!open || groups.length === 0) return;
    setPosition(getInitialPosition(groups, initialRestaurantId));
  }, [groups, initialRestaurantId, open]);

  const currentGroup = groups[position.groupIndex];
  const currentStory = currentGroup?.stories[position.storyIndex];

  useEffect(() => {
    if (!open || !currentGroup) return;
    onRestaurantSeen?.(currentGroup.restaurant);
  }, [currentGroup, onRestaurantSeen, open]);

  useEffect(() => {
    if (!open || !currentStory) return;

    const timeout = window.setTimeout(() => {
      setPosition((previous) => {
        const nextPosition = getNextPosition(previous, groups);
        if (!nextPosition) {
          onClose();
          return previous;
        }
        return nextPosition;
      });
    }, (currentStory.durationSeconds ?? 5) * 1000);

    return () => window.clearTimeout(timeout);
  }, [currentStory, groups, onClose, open]);

  const totalStories = currentGroup?.stories.length ?? 0;
  const hasPrevious = getPreviousPosition(position, groups) !== null;
  const hasNext = getNextPosition(position, groups) !== null;

  if (!open || !currentGroup || !currentStory) {
    return null;
  }

  const goToPrevious = () => {
    setPosition((previous) => getPreviousPosition(previous, groups) ?? previous);
  };

  const goToNext = () => {
    setPosition((previous) => {
      const nextPosition = getNextPosition(previous, groups);
      if (!nextPosition) {
        onClose();
        return previous;
      }
      return nextPosition;
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] overflow-hidden bg-black text-white"
      >
        <div className="absolute inset-0">
          <img
            src={currentStory.image}
            alt={currentStory.headline}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/85" />
        </div>

        <div className="relative z-20 flex h-full flex-col px-4 pb-6">
          <div className="safe-area-top" />
          <div className="px-1 pt-4">
            <div className="flex gap-1.5">
              {currentGroup.stories.map((story, index) => (
                <div
                  key={story.id}
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
                >
                  {index < position.storyIndex ? (
                    <div className="h-full w-full rounded-full bg-white" />
                  ) : index === position.storyIndex ? (
                    <motion.div
                      key={story.id}
                      className="h-full rounded-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: currentStory.durationSeconds ?? 5,
                        ease: "linear",
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={currentGroup.latestStory.image}
                  alt={currentGroup.restaurant.name}
                  className="h-10 w-10 rounded-full border border-white/30 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {currentGroup.restaurant.name}
                  </p>
                  <p className="truncate text-xs text-white/70">
                    {formatStoryAge(currentStory.postedAt)} ago
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-full bg-white/12 p-2 backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Close stories"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="relative z-30 rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-3 text-xs text-white/75">
                <span>
                  Story {position.storyIndex + 1} of {totalStories}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {currentGroup.restaurant.distance}
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold leading-tight">
                {currentStory.headline}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {currentStory.caption}
              </p>

              {onPrimaryAction && (
                <Button
                  variant="default"
                  size="lg"
                  className="mt-4 w-full border-0 shadow-lg shadow-primary/25"
                  onClick={() => {
                    onClose();
                    onPrimaryAction(currentGroup.restaurant);
                  }}
                >
                  {primaryActionLabel}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Previous story"
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/25 p-2 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/35 disabled:opacity-35"
        >
          <div className="pointer-events-none">
            <ChevronLeft className="h-4 w-4" />
          </div>
        </button>
        <button
          type="button"
          aria-label="Next story"
          onClick={goToNext}
          disabled={!hasNext}
          className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/25 p-2 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/35 disabled:opacity-35"
        >
          <div className="pointer-events-none">
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default RestaurantStoryViewer;
