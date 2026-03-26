import { motion } from "framer-motion";
import { Check, Clock3, CircleDashed, Mail, Store, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SubmittedApplicationState {
  city?: string;
  email?: string;
  ownerName?: string;
  restaurantName?: string;
}

const statusSteps = [
  {
    title: "Application received",
    description: "Owner account and restaurant details submitted.",
    state: "done" as const,
  },
  {
    title: "Review in progress",
    description: "Our team is verifying identity, profile, and photos.",
    state: "active" as const,
  },
  {
    title: "Access enabled",
    description: "Dashboard tools unlock after approval.",
    state: "upcoming" as const,
  },
];

const RestaurantApplicationPendingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submittedState =
    (location.state as SubmittedApplicationState | null) ?? {};

  const restaurantName = submittedState.restaurantName || "Your restaurant";
  const ownerName = submittedState.ownerName || "Restaurant owner";
  const email = submittedState.email || "your registered email";
  const city = submittedState.city;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#fefcf7] safe-area-top">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="px-5 pb-8 pt-10"
        >
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#efc41a]">
              <Check className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="mt-5 text-center text-[22px] font-bold leading-tight text-foreground">
            Application submitted
          </h1>
          <p className="mx-auto mt-2 max-w-[300px] text-center text-[14px] leading-6 text-muted-foreground">
            {restaurantName} has been sent for review. We'll update {email} when
            it's complete.
          </p>

          {/* Status badges */}
          <div className="mt-5 flex justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4d0] px-3 py-1.5 text-[13px] font-medium text-[#8a7020]">
              <Clock3 className="h-3.5 w-3.5" />
              1–2 days
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0e8d4] px-3 py-1.5 text-[13px] font-medium text-[#6b5e3a]">
              <CircleDashed className="h-3.5 w-3.5" />
              In review
            </span>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h2 className="text-[15px] font-semibold text-foreground">
              Review progress
            </h2>
            <div className="mt-3 space-y-0">
              {statusSteps.map((step, index) => {
                const done = step.state === "done";
                const active = step.state === "active";
                const isLast = index === statusSteps.length - 1;

                return (
                  <div key={step.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          done
                            ? "bg-[#efc41a] text-white"
                            : active
                              ? "border-2 border-[#efc41a] bg-white text-[#efc41a]"
                              : "border-2 border-[#e0d8c4] bg-white text-transparent"
                        }`}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        ) : active ? (
                          <span className="h-2 w-2 rounded-full bg-[#efc41a]" />
                        ) : null}
                      </span>
                      {!isLast && (
                        <span
                          className={`my-0.5 h-8 w-0.5 rounded-full ${
                            done ? "bg-[#efc41a]" : "bg-[#e8dfcb]"
                          }`}
                        />
                      )}
                    </div>

                    <div className={isLast ? "pb-0" : "pb-2"}>
                      <p
                        className={`text-[14px] font-semibold leading-6 ${
                          active
                            ? "text-foreground"
                            : done
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[13px] leading-5 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-7">
            <h2 className="text-[15px] font-semibold text-foreground">
              Application summary
            </h2>
            <div className="mt-3 rounded-2xl border border-[#e5dcc8] bg-white px-4 py-1">
              {[
                { label: "Restaurant", value: restaurantName, Icon: Store },
                { label: "Owner", value: ownerName, Icon: User },
                { label: "Contact", value: email, Icon: Mail },
              ].map(({ label, value, Icon }, index, arr) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 py-3 ${
                    index < arr.length - 1 ? "border-b border-[#eee0be]" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5ecd3] text-[#b89d30]">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-muted-foreground">{label}</p>
                    <p className="truncate text-[14px] font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div className="mt-7">
            <h2 className="text-[15px] font-semibold text-foreground">
              What happens next
            </h2>
            <div className="mt-3 space-y-2.5">
              {[
                city
                  ? `The review team will verify your application for ${city}.`
                  : "The review team will verify your application details.",
                "You may receive an email if anything needs clarification.",
                "The restaurant dashboard unlocks after approval.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4b94e]" />
                  <p className="text-[13px] leading-5 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#ede4cf] bg-white px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
        <button
          type="button"
          onClick={() => navigate("/restaurant-dashboard")}
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#efc41a] text-[15px] font-semibold text-[#4b3900] shadow-[0_4px_16px_rgba(239,196,26,0.3)] transition-transform active:scale-[0.98]"
        >
          Go to Dashboard
        </button>
        <p className="mt-2.5 text-center text-[12px] text-muted-foreground">
          Preview the restaurant dashboard.
        </p>
      </div>
    </div>
  );
};

export default RestaurantApplicationPendingPage;
