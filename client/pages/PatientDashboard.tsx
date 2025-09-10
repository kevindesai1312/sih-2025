import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatientAuth } from "@/lib/patient-auth";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Calendar, 
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Stethoscope,
  Clock,
  AlertTriangle
} from "lucide-react";

interface Appointment {
  _id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  doctorId: {
    name: string;
    specialization: string;
  };
}

export default function PatientDashboard() {
  const { patient, logout, token } = usePatientAuth();
  const nav = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patient || !token) {
      nav("/auth");
      return;
    }
    fetchAppointments();
  }, [patient, token, nav]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patient/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    nav("/auth");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.appointmentDate) >= new Date()
  ).slice(0, 3);

  if (!patient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Patient Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {patient.name}</p>
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
                <span className="text-sm font-medium">{patient.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{patient.address}</span>
              </div>
              {patient.bloodGroup && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{patient.bloodGroup}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-sm text-muted-foreground">Total appointments</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Scheduled:</span>
                  <span className="font-medium">
                    {appointments.filter(a => a.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed:</span>
                  <span className="font-medium">
                    {appointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => nav("/patient/book-appointment")}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => nav("/patient/appointments")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Appointments
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => nav("/patient/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading appointments...</p>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No upcoming appointments</p>
                  <Button onClick={() => nav("/patient/book-appointment")}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{appointment.doctorId.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {appointment.doctorId.specialization}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reason: {appointment.reason}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  ))}
                  {appointments.length > 3 && (
                    <div className="text-center pt-3">
                      <Button 
                        variant="outline" 
                        onClick={() => nav("/patient/appointments")}
                      >
                        View All Appointments
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Summary */}
        {(patient.medicalHistory?.length || patient.allergies?.length || patient.currentMedications?.length) && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Medical History</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.allergies && patient.allergies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.currentMedications && patient.currentMedications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Medications</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.currentMedications.map((medication, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}