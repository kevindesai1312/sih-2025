import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDoctorAuth } from "@/lib/doctor-auth";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Settings,
  LogOut,
  User,
  Mail,
  Phone
} from "lucide-react";

export default function DoctorDashboard() {
  const { doctor, logout, token } = useDoctorAuth();
  const nav = useNavigate();
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctor || !token) {
      nav("/doctor/auth");
      return;
    }
    fetchDashboardData();
  }, [doctor, token, nav]);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, slotsRes] = await Promise.all([
        fetch('/api/doctor/patients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/doctor/slots', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData);
      }

      if (slotsRes.ok) {
        const slotsData = await slotsRes.json();
        setSlots(slotsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    nav("/doctor/auth");
  };

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Dr. {doctor.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{doctor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">{doctor.specialization}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-sm text-muted-foreground">Total registered patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{slots.length}</div>
              <p className="text-sm text-muted-foreground">Total appointment slots</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Welcome to your doctor dashboard! Here you can manage your patients, 
                    appointment slots, and view your schedule.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => nav("/doctor/patients")}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Patients
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => nav("/doctor/slots")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Appointments
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}