import type { NavigateFunction, To } from "react-router-dom";

export const goBackOr = (navigate: NavigateFunction, fallback: To) => {
  const canGoBack =
    typeof window !== "undefined" &&
    typeof window.history.state?.idx === "number" &&
    window.history.state.idx > 0;

  if (canGoBack) {
    navigate(-1);
    return;
  }

  navigate(fallback, { replace: true });
};
