import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  ImageIcon,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { goBackOr } from "@/lib/navigation";

type StepKey = "account" | "identity" | "restaurant" | "review";

interface RestaurantAccessForm {
  ownerFullName: string;
  phoneNumber: string;
  email: string;
  legalFullName: string;
  dateOfBirth: string;
  nationality: string;
  currentAddress: string;
  cityProvince: string;
  restaurantNameKhmer: string;
  restaurantNameEnglish: string;
  category: string;
  cuisine: string;
  restaurantPhone: string;
  restaurantAddress: string;
  restaurantCity: string;
  googleMapsLink: string;
  businessRegistrationNumber: string;
  openingDays: string[];
  openingTime: string;
  closingTime: string;
  restaurantPhotos: string[];
  confirmAccuracy: boolean;
  confirmRepresentation: boolean;
  confirmManualReview: boolean;
}

const stepOrder: StepKey[] = ["account", "identity", "restaurant", "review"];

const stepMeta: Record<
  StepKey,
  {
    actionLabel: string;
    label: string;
    title: string;
    subtitle: string;
  }
> = {
  account: {
    actionLabel: "Continue",
    label: "Account",
    title: "Create your owner account",
    subtitle: "Contact info for onboarding updates and restaurant access.",
  },
  identity: {
    actionLabel: "Continue",
    label: "Identity",
    title: "Verify the owner",
    subtitle: "Legal identity used to verify the account holder.",
  },
  restaurant: {
    actionLabel: "Continue",
    label: "Restaurant",
    title: "Build the listing",
    subtitle: "Details customers and reviewers will see.",
  },
  review: {
    actionLabel: "Submit application",
    label: "Review",
    title: "Review & submit",
    subtitle: "Confirm everything before sending for approval.",
  },
};

const provinceOptions = ["Phnom Penh", "Siem Reap", "Battambang", "Kampot"];
const categoryOptions = [
  "Khmer restaurant",
  "Cafe",
  "Street food",
  "Seafood restaurant",
];
const cuisineOptions = [
  "Asian fusion",
  "Traditional Khmer",
  "BBQ and grill",
  "International",
];
const openingDayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const fieldClassName =
  "block h-12 w-full min-w-0 rounded-xl border border-[#e5dcc8] bg-[#fdfaf3] px-4 text-[15px] text-foreground outline-none transition-all placeholder:text-[#b4a78a] focus:border-[#d4a917] focus:ring-2 focus:ring-[#f1ca3f]/20";

const textareaClassName =
  "block min-h-[96px] w-full min-w-0 rounded-xl border border-[#e5dcc8] bg-[#fdfaf3] px-4 py-3 text-[15px] text-foreground outline-none transition-all placeholder:text-[#b4a78a] focus:border-[#d4a917] focus:ring-2 focus:ring-[#f1ca3f]/20";

const initialForm: RestaurantAccessForm = {
  ownerFullName: "kheang",
  phoneNumber: "099791792",
  email: "kimkheang982@gmail.com",
  legalFullName: "khorn kimkhimmengkheang",
  dateOfBirth: "01/01/2004",
  nationality: "Cambodian",
  currentAddress: "Phnom Penh",
  cityProvince: "Phnom Penh",
  restaurantNameKhmer: "ភូមិខ្មែរ",
  restaurantNameEnglish: "khmer food",
  category: "Khmer restaurant",
  cuisine: "Asian fusion",
  restaurantPhone: "099 700 603",
  restaurantAddress: "Phnom Penh",
  restaurantCity: "Phnom Penh",
  googleMapsLink: "https://maps.app.g",
  businessRegistrationNumber: "123456789",
  openingDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  openingTime: "08:00 AM",
  closingTime: "08:00 PM",
  restaurantPhotos: ["wallpaperflare.com_wallpa..."],
  confirmAccuracy: true,
  confirmRepresentation: false,
  confirmManualReview: false,
};

/* ── Lightweight sub-components ── */

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="flex min-w-0 flex-col gap-1.5">
    <span className="text-[13px] font-medium text-[#6b5e47]">{label}</span>
    {children}
  </label>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={(event) => onChange(event.target.value)}
    className={fieldClassName}
  />
);

const SelectInput = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) => (
  <div className="relative min-w-0">
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${fieldClassName} appearance-none pr-11`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a59678]" />
  </div>
);

const DateInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="relative min-w-0">
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${fieldClassName} pr-11`}
    />
    <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#564a35]" />
  </div>
);

const TimeInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="relative min-w-0">
    <TextInput value={value} onChange={onChange} />
    <Clock3 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#85765c]" />
  </div>
);

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div className="pt-2">
    <h3 className="text-[16px] font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
        {description}
      </p>
    )}
  </div>
);

const ReviewRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <div
    className={`flex items-start justify-between gap-4 py-3 ${
      isLast ? "" : "border-b border-[#eee0be]"
    }`}
  >
    <span className="text-[13px] text-[#8d7c5d]">{label}</span>
    <span className="max-w-[62%] text-right text-[13px] font-medium leading-5 text-foreground">
      {value}
    </span>
  </div>
);

const ConfirmationRow = ({
  checked,
  onToggle,
  label,
  description,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
      checked
        ? "border-[#efc41a] bg-[#fffaf0]"
        : "border-[#e5dcc8] bg-[#fdfaf3]"
    }`}
  >
    <span
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked
          ? "border-[#efc41a] bg-[#efc41a] text-white"
          : "border-[#d4cbb3] bg-transparent text-transparent"
      }`}
    >
      <Check className="h-[10px] w-[10px]" strokeWidth={3} />
    </span>
    <span className="min-w-0">
      <span className="block text-[14px] font-semibold leading-5 text-foreground">
        {label}
      </span>
      <span className="mt-0.5 block text-[12px] leading-5 text-muted-foreground">
        {description}
      </span>
    </span>
  </button>
);

/* ── Main page ── */

const RestaurantAccessPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<RestaurantAccessForm>(initialForm);

  const step = stepOrder[stepIndex];
  const meta = stepMeta[step];
  const isLastStep = stepIndex === stepOrder.length - 1;

  const updateForm = <K extends keyof RestaurantAccessForm>(
    key: K,
    value: RestaurantAccessForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  const nextStep = () => {
    if (isLastStep) {
      if (
        !form.confirmAccuracy ||
        !form.confirmRepresentation ||
        !form.confirmManualReview
      ) {
        toast.error("Please complete all review confirmations before submitting.");
        return;
      }

      toast.success("Restaurant application submitted for review.");
      navigate("/restaurant-application-pending", {
        replace: true,
        state: {
          city: form.restaurantCity,
          email: form.email,
          ownerName: form.ownerFullName,
          restaurantName: form.restaurantNameEnglish,
        },
      });
      return;
    }

    setStepIndex((current) => Math.min(current + 1, stepOrder.length - 1));
  };

  const previousStep = () => {
    if (stepIndex === 0) {
      goBackOr(navigate, "/signup");
      return;
    }

    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const toggleOpeningDay = (day: string) => {
    setForm((current) => {
      const nextDays = current.openingDays.includes(day)
        ? current.openingDays.filter((value) => value !== day)
        : openingDayOptions.filter((value) =>
            [...current.openingDays, day].includes(value),
          );

      return {
        ...current,
        openingDays: nextDays,
      };
    });
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPhotos = Array.from(event.target.files ?? []).map(
      (file) => file.name,
    );

    if (!nextPhotos.length) return;

    setForm((current) => ({
      ...current,
      restaurantPhotos: [...current.restaurantPhotos, ...nextPhotos],
    }));

    event.target.value = "";
  };

  const ownerSummaryRows = useMemo(
    () => [
      { label: "Owner", value: form.ownerFullName },
      { label: "Phone", value: form.phoneNumber },
      { label: "Email", value: form.email },
      { label: "Legal name", value: form.legalFullName },
      { label: "Date of birth", value: form.dateOfBirth },
      { label: "Nationality", value: form.nationality },
    ],
    [
      form.dateOfBirth,
      form.email,
      form.legalFullName,
      form.nationality,
      form.ownerFullName,
      form.phoneNumber,
    ],
  );

  const restaurantSummaryRows = useMemo(
    () => [
      { label: "Restaurant", value: form.restaurantNameEnglish },
      { label: "Category", value: form.category },
      { label: "Cuisine", value: form.cuisine },
      { label: "City", value: form.restaurantCity },
      { label: "Hours", value: `${form.openingTime} – ${form.closingTime}` },
      {
        label: "Opening days",
        value:
          form.openingDays.length === openingDayOptions.length
            ? "Every day"
            : form.openingDays.join(", "),
      },
      {
        label: "Photos",
        value: `${form.restaurantPhotos.length} uploaded`,
      },
    ],
    [
      form.category,
      form.closingTime,
      form.cuisine,
      form.openingDays,
      form.openingTime,
      form.restaurantCity,
      form.restaurantNameEnglish,
      form.restaurantPhotos.length,
    ],
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#fefcf7] safe-area-top">
      {/* ── Compact header ── */}
      <header className="border-b border-[#ede4cf] bg-white px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={previousStep}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4b3f2a] transition-transform active:scale-90"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-foreground">
              Step {stepIndex + 1} of {stepOrder.length}
            </p>
          </div>

          {/* Step labels */}
          <div className="flex items-center gap-1">
            {stepOrder.map((item, index) => {
              const isDone = index < stepIndex;
              const isActive = index === stepIndex;

              return (
                <span
                  key={item}
                  className={`flex h-6 items-center rounded-full px-2 text-[11px] font-semibold transition-colors ${
                    isDone
                      ? "bg-[#efc41a] text-white"
                      : isActive
                        ? "bg-[#f5ecd3] text-[#8a7440]"
                        : "text-[#c4b899]"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Thin progress bar */}
        <div className="mt-3 flex gap-1.5">
          {stepOrder.map((item, index) => {
            const isDone = index < stepIndex;
            const isActive = item === step;

            return (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  isDone
                    ? "bg-[#efc41a]"
                    : isActive
                      ? "bg-[#f5d44b]"
                      : "bg-[#e8dfcb]"
                }`}
              />
            );
          })}
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto px-5 pb-6 pt-4 scrollbar-hide"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {/* Step title inside content area */}
              <div>
                <h2 className="text-[22px] font-bold leading-tight text-foreground">
                  {meta.title}
                </h2>
                <p className="mt-1.5 text-[14px] leading-6 text-muted-foreground">
                  {meta.subtitle}
                </p>
              </div>

              {/* ── Step 1: Account ── */}
              {step === "account" && (
                <div className="space-y-4">
                  <Field label="Full name">
                    <TextInput
                      value={form.ownerFullName}
                      onChange={(value) => updateForm("ownerFullName", value)}
                      placeholder="Enter your full name"
                    />
                  </Field>

                  <Field label="Phone number">
                    <TextInput
                      value={form.phoneNumber}
                      onChange={(value) => updateForm("phoneNumber", value)}
                      type="tel"
                      placeholder="012 345 678"
                    />
                  </Field>

                  <Field label="Email">
                    <TextInput
                      value={form.email}
                      onChange={(value) => updateForm("email", value)}
                      type="email"
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 2: Identity ── */}
              {step === "identity" && (
                <div className="space-y-4">
                  <Field label="Legal full name">
                    <TextInput
                      value={form.legalFullName}
                      onChange={(value) => updateForm("legalFullName", value)}
                      placeholder="As shown on ID"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date of birth">
                      <DateInput
                        value={form.dateOfBirth}
                        onChange={(value) => updateForm("dateOfBirth", value)}
                      />
                    </Field>

                    <Field label="Nationality">
                      <TextInput
                        value={form.nationality}
                        onChange={(value) => updateForm("nationality", value)}
                      />
                    </Field>
                  </div>

                  <SectionHeading title="Address" />

                  <Field label="City / province">
                    <SelectInput
                      value={form.cityProvince}
                      onChange={(value) => updateForm("cityProvince", value)}
                      options={provinceOptions}
                    />
                  </Field>

                  <Field label="Current address">
                    <textarea
                      value={form.currentAddress}
                      onChange={(event) =>
                        updateForm("currentAddress", event.target.value)
                      }
                      placeholder="Street, building, etc."
                      className={textareaClassName}
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 3: Restaurant ── */}
              {step === "restaurant" && (
                <div className="space-y-4">
                  <Field label="Restaurant name (Khmer)">
                    <TextInput
                      value={form.restaurantNameKhmer}
                      onChange={(value) =>
                        updateForm("restaurantNameKhmer", value)
                      }
                    />
                  </Field>

                  <Field label="Restaurant name (English)">
                    <TextInput
                      value={form.restaurantNameEnglish}
                      onChange={(value) =>
                        updateForm("restaurantNameEnglish", value)
                      }
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Category">
                      <SelectInput
                        value={form.category}
                        onChange={(value) => updateForm("category", value)}
                        options={categoryOptions}
                      />
                    </Field>

                    <Field label="Cuisine">
                      <SelectInput
                        value={form.cuisine}
                        onChange={(value) => updateForm("cuisine", value)}
                        options={cuisineOptions}
                      />
                    </Field>
                  </div>

                  <Field label="Restaurant phone">
                    <TextInput
                      value={form.restaurantPhone}
                      onChange={(value) => updateForm("restaurantPhone", value)}
                      type="tel"
                    />
                  </Field>

                  <SectionHeading title="Location" />

                  <Field label="Address">
                    <textarea
                      value={form.restaurantAddress}
                      onChange={(event) =>
                        updateForm("restaurantAddress", event.target.value)
                      }
                      className={textareaClassName}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City / province">
                      <SelectInput
                        value={form.restaurantCity}
                        onChange={(value) => updateForm("restaurantCity", value)}
                        options={provinceOptions}
                      />
                    </Field>

                    <Field label="Google Maps link">
                      <TextInput
                        value={form.googleMapsLink}
                        onChange={(value) => updateForm("googleMapsLink", value)}
                      />
                    </Field>
                  </div>

                  <Field label="Business registration number">
                    <TextInput
                      value={form.businessRegistrationNumber}
                      onChange={(value) =>
                        updateForm("businessRegistrationNumber", value)
                      }
                    />
                  </Field>

                  <SectionHeading title="Schedule" />

                  <Field label="Opening days">
                    <div className="flex flex-wrap gap-2">
                      {openingDayOptions.map((day) => {
                        const selected = form.openingDays.includes(day);

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleOpeningDay(day)}
                            className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                              selected
                                ? "border-[#efc41a] bg-[#fff6d8] text-[#9a7d00]"
                                : "border-[#e5dcc8] bg-white text-[#6f6452]"
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Opening time">
                      <TimeInput
                        value={form.openingTime}
                        onChange={(value) => updateForm("openingTime", value)}
                      />
                    </Field>

                    <Field label="Closing time">
                      <TimeInput
                        value={form.closingTime}
                        onChange={(value) => updateForm("closingTime", value)}
                      />
                    </Field>
                  </div>

                  <SectionHeading title="Photos" />

                  <div className="rounded-2xl border border-dashed border-[#e0d5bd] bg-[#fdfaf3] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5ecd3] text-[#c9a400]">
                        <ImageIcon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <p className="text-[13px] leading-5 text-muted-foreground">
                        Upload at least one photo that shows the restaurant.
                      </p>
                    </div>

                    <input
                      ref={photoInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />

                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d8c68d] bg-white text-[13px] font-semibold text-[#69593e] transition-colors active:bg-[#faf5e8]"
                    >
                      <Upload className="h-4 w-4" />
                      Upload photos
                    </button>
                  </div>

                  {form.restaurantPhotos.length > 0 && (
                    <div className="space-y-2">
                      {form.restaurantPhotos.map((photo) => (
                        <div
                          key={photo}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#e5dcc8] bg-white px-4 py-2.5"
                        >
                          <p className="truncate text-[13px] text-foreground">
                            {photo}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                restaurantPhotos:
                                  current.restaurantPhotos.filter(
                                    (value) => value !== photo,
                                  ),
                              }))
                            }
                            className="shrink-0 text-[12px] font-medium text-[#b4564c]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: Review ── */}
              {step === "review" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      Owner details
                    </h3>
                    <div className="mt-2 rounded-2xl border border-[#e5dcc8] bg-white px-4 py-1">
                      {ownerSummaryRows.map((row, index) => (
                        <ReviewRow
                          key={row.label}
                          label={row.label}
                          value={row.value}
                          isLast={index === ownerSummaryRows.length - 1}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      Restaurant details
                    </h3>
                    <div className="mt-2 rounded-2xl border border-[#e5dcc8] bg-white px-4 py-1">
                      {restaurantSummaryRows.map((row, index) => (
                        <ReviewRow
                          key={row.label}
                          label={row.label}
                          value={row.value}
                          isLast={index === restaurantSummaryRows.length - 1}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      Confirmations
                    </h3>
                    <div className="mt-2 space-y-2.5">
                      <ConfirmationRow
                        checked={form.confirmAccuracy}
                        onToggle={() =>
                          updateForm("confirmAccuracy", !form.confirmAccuracy)
                        }
                        label="All information is accurate"
                        description="I reviewed the owner and restaurant details above."
                      />

                      <ConfirmationRow
                        checked={form.confirmRepresentation}
                        onToggle={() =>
                          updateForm(
                            "confirmRepresentation",
                            !form.confirmRepresentation,
                          )
                        }
                        label="Authorized to represent this restaurant"
                        description="I have permission to manage this business listing."
                      />

                      <ConfirmationRow
                        checked={form.confirmManualReview}
                        onToggle={() =>
                          updateForm(
                            "confirmManualReview",
                            !form.confirmManualReview,
                          )
                        }
                        label="I agree to manual review"
                        description="The dashboard unlocks only after approval."
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Compact footer ── */}
      <div className="border-t border-[#ede4cf] bg-white px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={previousStep}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e5dcc8] bg-white text-[#544632] transition-transform active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#efc41a] text-[15px] font-semibold text-[#4b3900] shadow-[0_4px_16px_rgba(239,196,26,0.3)] transition-transform active:scale-[0.98]"
          >
            {meta.actionLabel}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAccessPage;
