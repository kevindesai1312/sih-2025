import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { I18nProvider } from "./lib/i18n.tsx";
import { AuthProvider } from "./lib/auth";
import { DoctorAuthProvider } from "./lib/doctor-auth";
import { PatientAuthProvider } from "./lib/patient-auth";
import Auth from "./pages/Auth";
import DoctorAuth from "./pages/DoctorAuth";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientManagement from "./pages/PatientManagement";
import SlotManagement from "./pages/SlotManagement";
import PatientDashboard from "./pages/PatientDashboard";
import PatientBookAppointment from "./pages/PatientBookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import PatientProfile from "./pages/PatientProfile";
import Awareness from "./pages/Awareness";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
            <DoctorAuthProvider>
              <PatientAuthProvider>
                <Routes>
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/auth" element={<Layout><Auth /></Layout>} />
                  <Route path="/awareness" element={<Layout><Awareness /></Layout>} />
                  {/* Doctor routes without main layout */}
                  <Route path="/doctor/auth" element={<DoctorAuth />} />
                  <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                  <Route path="/doctor/patients" element={<PatientManagement />} />
                  <Route path="/doctor/slots" element={<SlotManagement />} />
                  {/* Patient routes without main layout */}
                  <Route path="/patient/dashboard" element={<PatientDashboard />} />
                  <Route path="/patient/book-appointment" element={<PatientBookAppointment />} />
                  <Route path="/patient/appointments" element={<PatientAppointments />} />
                  <Route path="/patient/profile" element={<PatientProfile />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </PatientAuthProvider>
            </DoctorAuthProvider>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
