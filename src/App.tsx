import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingsProvider } from "@/contexts/BookingsContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import { useAuth } from "@/contexts/AuthContext";
import WelcomePage from "@/pages/WelcomePage";
import SignUpPage from "@/pages/SignUpPage";
import CustomerSignUpPage from "@/pages/CustomerSignUpPage";
import RestaurantAccessPage from "@/pages/RestaurantAccessPage";
import RestaurantApplicationPendingPage from "@/pages/RestaurantApplicationPendingPage";
import RestaurantDashboardPage from "@/pages/RestaurantDashboardPage";
import RestaurantMenuPage from "@/pages/RestaurantMenuPage";
import RestaurantTablesPage from "@/pages/RestaurantTablesPage";
import RestaurantBookingsPage from "@/pages/RestaurantBookingsPage";
import RestaurantProfilePage from "@/pages/RestaurantProfilePage";
import RestaurantNotificationsPage from "@/pages/RestaurantNotificationsPage";
import RestaurantSettingsPage from "@/pages/RestaurantSettingsPage";
import RestaurantStoryPage from "@/pages/RestaurantStoryPage";
import RestaurantEditProfilePage from "@/pages/RestaurantEditProfilePage";
import RestaurantNotificationSettingsPage from "@/pages/RestaurantNotificationSettingsPage";
import RestaurantFavoritesPage from "@/pages/RestaurantFavoritesPage";
import RestaurantLanguagePage from "@/pages/RestaurantLanguagePage";
import SignInPage from "@/pages/SignInPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import BookTablePage from "@/pages/BookTablePage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";
import BookingHistoryPage from "@/pages/BookingHistoryPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationsPage from "@/pages/NotificationsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import PrivacySecurityPage from "@/pages/PrivacySecurityPage";
import HelpSupportPage from "@/pages/HelpSupportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireSession = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isGuest, isReady } = useAuth();
  if (!isReady) return null;
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const PublicLanding = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isGuest, isReady } = useAuth();
  if (!isReady) return null;
  if (isAuthenticated || isGuest) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingsProvider>
        <FavoritesProvider>
          <ReviewsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="h-full w-full overflow-hidden bg-background">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PublicLanding>
                          <WelcomePage />
                        </PublicLanding>
                      }
                    />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                      path="/signup/customer"
                      element={<CustomerSignUpPage />}
                    />
                    <Route
                      path="/restaurant-access"
                      element={<RestaurantAccessPage />}
                    />
                    <Route
                      path="/restaurant-application-pending"
                      element={<RestaurantApplicationPendingPage />}
                    />
                    <Route
                      path="/restaurant-dashboard"
                      element={<RestaurantDashboardPage />}
                    />
                    <Route
                      path="/restaurant-menu"
                      element={<RestaurantMenuPage />}
                    />
                    <Route
                      path="/restaurant-tables"
                      element={<RestaurantTablesPage />}
                    />
                    <Route
                      path="/restaurant-bookings"
                      element={<RestaurantBookingsPage />}
                    />
                    <Route
                      path="/restaurant-profile"
                      element={<RestaurantProfilePage />}
                    />
                    <Route
                      path="/restaurant-notifications"
                      element={<RestaurantNotificationsPage />}
                    />
                    <Route
                      path="/restaurant-settings"
                      element={<RestaurantSettingsPage />}
                    />
                    <Route
                      path="/restaurant-stories"
                      element={<RestaurantStoryPage />}
                    />
                    <Route
                      path="/restaurant-edit-profile"
                      element={<RestaurantEditProfilePage />}
                    />
                    <Route
                      path="/restaurant-notification-settings"
                      element={<RestaurantNotificationSettingsPage />}
                    />
                    <Route
                      path="/restaurant-favorites"
                      element={<RestaurantFavoritesPage />}
                    />
                    <Route
                      path="/restaurant-language"
                      element={<RestaurantLanguagePage />}
                    />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/verify" element={<VerifyEmailPage />} />
                    <Route
                      path="/reset-password"
                      element={<ResetPasswordPage />}
                    />
                    <Route
                      path="/home"
                      element={
                        <RequireSession>
                          <HomePage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <RequireSession>
                          <SearchPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/restaurant/:id"
                      element={
                        <RequireSession>
                          <RestaurantDetailPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/book/:id"
                      element={
                        <RequireSession>
                          <BookTablePage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/booking-confirmation"
                      element={
                        <RequireSession>
                          <BookingConfirmationPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <RequireSession>
                          <BookingHistoryPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <RequireSession>
                          <ProfilePage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        <RequireSession>
                          <FavoritesPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/privacy-security"
                      element={
                        <RequireSession>
                          <PrivacySecurityPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/help-support"
                      element={
                        <RequireSession>
                          <HelpSupportPage />
                        </RequireSession>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <RequireSession>
                          <NotificationsPage />
                        </RequireSession>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </ReviewsProvider>
        </FavoritesProvider>
      </BookingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
