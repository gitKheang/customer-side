import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import WelcomePage from "@/pages/WelcomePage";
import SignUpPage from "@/pages/SignUpPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import DietaryPreferencesPage from "@/pages/DietaryPreferencesPage";
import ChallengesPage from "@/pages/ChallengesPage";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import BookTablePage from "@/pages/BookTablePage";
import BookingHistoryPage from "@/pages/BookingHistoryPage";
import RewardsPage from "@/pages/RewardsPage";
import ProfilePage from "@/pages/ProfilePage";
import OrdersPage from "@/pages/OrdersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify" element={<VerifyEmailPage />} />
            <Route path="/dietary-preferences" element={<DietaryPreferencesPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
            <Route path="/book/:id" element={<BookTablePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/history" element={<BookingHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
