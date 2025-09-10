import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { I18nProvider } from "./lib/i18n.tsx";
import { UnifiedAuthProvider } from "./lib/unified-auth";
import { PatientGuard, DoctorGuard, GuestAllowedGuard } from "./components/guards/AuthGuard";
import UnifiedAuth from "./pages/UnifiedAuth";
import { DemoSeeder } from "./components/DemoSeeder";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientManagement from "./pages/PatientManagement";
import SlotManagement from "./pages/SlotManagement";
import PatientDashboard from "./pages/PatientDashboard";
import PatientBookAppointment from "./pages/PatientBookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import PatientProfile from "./pages/PatientProfile";
import GuestDashboard from "./pages/GuestDashboard";
import Awareness from "./pages/Awareness";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <UnifiedAuthProvider>
            <DemoSeeder />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <GuestAllowedGuard>
                  <Layout><Index /></Layout>
                </GuestAllowedGuard>
              } />
              <Route path="/guest/dashboard" element={
                <Layout><GuestDashboard /></Layout>
              } />
              <Route path="/login" element={<Layout><UnifiedAuth /></Layout>} />
              <Route path="/awareness" element={
                <GuestAllowedGuard>
                  <Layout><Awareness /></Layout>
                </GuestAllowedGuard>
              } />
              
              {/* Legacy auth routes - redirect to unified login */}
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              <Route path="/doctor/auth" element={<Navigate to="/login" replace />} />
              
              {/* Doctor routes - protected */}
              <Route path="/doctor/dashboard" element={
                <DoctorGuard>
                  <DoctorDashboard />
                </DoctorGuard>
              } />
              <Route path="/doctor/patients" element={
                <DoctorGuard>
                  <PatientManagement />
                </DoctorGuard>
              } />
              <Route path="/doctor/slots" element={
                <DoctorGuard>
                  <SlotManagement />
                </DoctorGuard>
              } />
              
              {/* Patient routes - protected */}
              <Route path="/patient/dashboard" element={
                <PatientGuard>
                  <PatientDashboard />
                </PatientGuard>
              } />
              <Route path="/patient/book-appointment" element={
                <PatientGuard>
                  <PatientBookAppointment />
                </PatientGuard>
              } />
              <Route path="/patient/appointments" element={
                <PatientGuard>
                  <PatientAppointments />
                </PatientGuard>
              } />
              <Route path="/patient/profile" element={
                <PatientGuard>
                  <PatientProfile />
                </PatientGuard>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </UnifiedAuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
