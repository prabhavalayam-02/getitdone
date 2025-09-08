import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import UserDashboard from "./pages/user/UserDashboard";
import CreateTaskPage from "./pages/user/CreateTaskPage";
import MyTasksPage from "./pages/user/MyTasksPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import HelperDashboard from "./pages/helper/HelperDashboard";
import AvailableTasksPage from "./pages/helper/AvailableTasksPage";
import HelperMyTasksPage from "./pages/helper/HelperMyTasksPage";
import HelperProfilePage from "./pages/helper/HelperProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          
          {/* User Routes */}
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/create-task" element={<CreateTaskPage />} />
          <Route path="/user/my-tasks" element={<MyTasksPage />} />
          <Route path="/user/profile" element={<UserProfilePage />} />
          
          {/* Helper Routes */}
          <Route path="/helper" element={<HelperDashboard />} />
          <Route path="/helper/available-tasks" element={<AvailableTasksPage />} />
          <Route path="/helper/my-tasks" element={<HelperMyTasksPage />} />
          <Route path="/helper/profile" element={<HelperProfilePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
