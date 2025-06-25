import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/hooks/useAuth"
import { ThemeProvider } from "@/components/theme-provider"
import ProtectedRoute from "@/components/ProtectedRoute"
import { PublicLayout, DashboardLayout } from "@/components/layout"

// Pages
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import CustomerDashboard from "./pages/CustomerDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import Index from "./pages/DashboardRedirect"
import Members from "./pages/Members"
import Staff from "./pages/Staff"
import Attendance from "./pages/Attendance"
import Memberships from "./pages/Memberships"
import Payments from "./pages/PaymentHistory"
import Reports from "./pages/Reports"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import BookClass from "./components/BookClass"
import BookingRequests from "./components/BookingRequests"
import DashboardRedirect from "./pages/DashboardRedirect"
import PaymentHistory from "./pages/PaymentHistory"
import WeeklySchedule from "./pages/WeeklySchedule"

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <PublicLayout>
                      <Landing />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicLayout>
                      <Login />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicLayout>
                      <Signup />
                    </PublicLayout>
                  }
                />

                {/* Protected Routes with Dashboard Layout */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <DashboardLayout>
                        <AdminDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <DashboardLayout>
                        <CustomerDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/manager"
                  element={
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <DashboardLayout>
                        <ManagerDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "customer"]}>
                      <DashboardLayout>
                        <DashboardRedirect />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/members"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <DashboardLayout>
                        <Members />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/booking-requests"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <DashboardLayout>
                        <BookingRequests />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <DashboardLayout>
                        <Staff />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/attendance"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <DashboardLayout>
                        <Attendance />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/memberships"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <DashboardLayout>
                        <Memberships />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/Payments"    
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager","customer"]}>
                      <DashboardLayout>
                        <PaymentHistory />
                      </DashboardLayout>  
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <DashboardLayout>
                        <Reports />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/book-class"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "customer"]}>
                      <DashboardLayout>
                        <BookClass />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                    <Route
                  path="/weekly-schedule"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "customer"]}>
                      <DashboardLayout>
                        <WeeklySchedule />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
                <Route
                  path="*"
                  element={
                    <PublicLayout>
                      <NotFound />
                    </PublicLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
  