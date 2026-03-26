import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CircleHelp,
  Mail,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { goBackOr } from "@/lib/navigation";
import RestaurantBottomNav from "@/components/RestaurantBottomNav";

const faqs = [
  {
    id: "faq-1",
    question: "How do I approve or decline reservations?",
    answer:
      "Open Bookings, review the pending reservation request, then confirm or decline it from the booking card.",
  },
  {
    id: "faq-2",
    question: "Where do I update restaurant details?",
    answer:
      "Open Settings or Edit Profile to update your business information, hours, contact details, and profile image.",
  },
  {
    id: "faq-3",
    question: "How do I know when the restaurant profile changes are live?",
    answer:
      "Important profile and review updates appear in Notifications after the platform completes verification.",
  },
];

const RestaurantHelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-background">
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
          <h1 className="text-lg font-bold text-foreground">Help & Support</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Restaurant operations help and support links
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide">
        <div className="mt-2 rounded-2xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <CircleHelp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Need help with owner tools?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Use the links below to quickly access reservations, alerts, and
                business settings.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2 rounded-2xl border border-border p-4">
          <p className="text-xs font-semibold text-foreground">Quick access</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/restaurant-bookings")}
          >
            <CalendarDays className="h-4 w-4" /> Bookings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/restaurant-notifications")}
          >
            <Bell className="h-4 w-4" /> Notifications
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/restaurant-settings")}
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              window.location.href = "mailto:support@foodreserve.app";
            }}
          >
            <Mail className="h-4 w-4" /> Contact Support
          </Button>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-semibold text-foreground">
              Owner FAQs
            </p>
          </div>

          <Accordion type="single" collapsible className="px-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <RestaurantBottomNav />
    </div>
  );
};

export default RestaurantHelpPage;
