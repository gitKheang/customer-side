import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CircleHelp,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { goBackOr } from "@/lib/navigation";

const faqs = [
  {
    id: "faq-1",
    question: "How do I modify or cancel a reservation?",
    answer:
      "Open Booking History, select an upcoming reservation, then choose Modify or Cancel.",
  },
  {
    id: "faq-2",
    question: "Why can't I book as a guest?",
    answer:
      "Guest mode is for browsing. Sign in to create reservations and manage your booking history.",
  },
  {
    id: "faq-3",
    question: "Where can I see booking updates?",
    answer:
      "Booking updates appear in Notifications and in your Booking History status.",
  },
];

const HelpSupportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="safe-area-top" />

      <div className="flex items-center gap-3 px-5 pb-2">
        <button
          onClick={() => goBackOr(navigate, "/profile")}
          className="rounded-full p-2 hover:bg-secondary transition-colors active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Help & Support</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Reservation help and key support links
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-hide">
        <div className="mt-2 rounded-2xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <CircleHelp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Need reservation assistance?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Use the pages below to quickly resolve common booking issues.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-border p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">Quick access</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/history")}
          >
            <CalendarDays className="h-4 w-4" /> Booking History
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-4 w-4" /> Notifications
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              window.location.href = "mailto:support@customerdelighthub.app";
            }}
          >
            <Mail className="h-4 w-4" /> Contact Support
          </Button>
        </div>

        <div className="mt-3 rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-semibold text-foreground">
              Reservation FAQs
            </p>
          </div>

          <Accordion type="single" collapsible className="px-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-sm text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
