import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { goBackOr } from "@/lib/navigation";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-background safe-area-top px-7 pb-8">
      <button
        onClick={() => goBackOr(navigate, "/")}
        className="-ml-2 mt-3 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="flex flex-1 flex-col pt-12"
      >
        <div className="max-w-[312px]">
          <h1 className="text-[25px] font-bold leading-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            Create a customer account here. Restaurant owner registration
            starts from restaurant access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/signup/customer")}
          className="mt-8 flex w-full items-center gap-4 rounded-[28px] border border-[#e4d5ad] bg-card px-4 py-5 text-left shadow-[0_4px_18px_rgba(103,80,28,0.08)] transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff4c8] text-primary">
            <UserPlus className="h-6 w-6" strokeWidth={1.9} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-foreground">
              Customer account
            </p>
            <p className="mt-1 text-[15px] leading-7 text-muted-foreground">
              Book tables, save favorites, and manage your reservation history.
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>

        <div className="mt-6 rounded-[28px] border border-dashed border-[#e8d7ae] bg-[#fff7df] px-4 py-5">
          <p className="text-[14px] leading-7 text-muted-foreground">
            Registering as a Cambodia restaurant owner? Use restaurant access
            and select Create owner account to begin onboarding.
          </p>

          <button
            type="button"
            onClick={() => navigate("/restaurant-access")}
            className="mt-4 text-[15px] font-semibold text-primary"
          >
            Open restaurant access
          </button>
        </div>

        <p className="mt-auto pt-10 text-[15px] text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-primary"
            onClick={() => navigate("/signin")}
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
