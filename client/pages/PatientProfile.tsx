import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePatientAuth } from "@/lib/patient-auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertTriangle,
  Save,
  Plus,
  X
} from "lucide-react";

export default function PatientProfile() {
  const { patient, token } = usePatientAuth();
  const nav = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    bloodGroup: "",
    medicalHistory: [] as string[],
    allergies: [] as string[],
    currentMedications: [] as string[]
  });

  // Form fields for adding new items
  const [newMedicalHistory, setNewMedicalHistory] = useState<string>("");
  const [newAllergy, setNewAllergy] = useState<string>("");
  const [newMedication, setNewMedication] = useState<string>("");

  useEffect(() => {
    if (!patient || !token) {
      nav("/auth");
      return;
    }
    
    // Initialize form with patient data
    setProfileData({
      name: patient.name || "",
      phone: patient.phone || "",
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : "",
      gender: patient.gender || "",
      address: patient.address || "",
      emergencyContact: {
        name: patient.emergencyContact?.name || "",
        phone: patient.emergencyContact?.phone || "",
        relationship: patient.emergencyContact?.relationship || ""
      },
      bloodGroup: patient.bloodGroup || "",
      medicalHistory: patient.medicalHistory || [],
      allergies: patient.allergies || [],
      currentMedications: patient.currentMedications || []
    });
  }, [patient, token, nav]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const addToList = (listType: 'medicalHistory' | 'allergies' | 'currentMedications', value: string) => {
    if (!value.trim()) return;
    
    setProfileData(prev => ({
      ...prev,
      [listType]: [...prev[listType], value.trim()]
    }));

    // Clear the input
    if (listType === 'medicalHistory') setNewMedicalHistory("");
    if (listType === 'allergies') setNewAllergy("");
    if (listType === 'currentMedications') setNewMedication("");
  };

  const removeFromList = (listType: 'medicalHistory' | 'allergies' | 'currentMedications', index: number) => {
    setProfileData(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        // Optionally refresh patient data or navigate back
        nav("/patient/dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
              <Button variant="ghost" onClick={() => nav("/patient/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <User className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">My Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your personal and medical information</p>
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={profileData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    value={profileData.emergencyContact.name}
                    onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    placeholder="Contact person's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={profileData.emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    placeholder="Contact phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyRelationship">Relationship *</Label>
                  <Select 
                    value={profileData.emergencyContact.relationship} 
                    onValueChange={(value) => handleEmergencyContactChange('relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newMedicalHistory}
                  onChange={(e) => setNewMedicalHistory(e.target.value)}
                  placeholder="Add medical condition or history"
                  onKeyPress={(e) => e.key === 'Enter' && addToList('medicalHistory', newMedicalHistory)}
                />
                <Button 
                  onClick={() => addToList('medicalHistory', newMedicalHistory)}
                  disabled={!newMedicalHistory.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {profileData.medicalHistory.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.medicalHistory.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {condition}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 hover:bg-transparent"
                        onClick={() => removeFromList('medicalHistory', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Allergies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy (e.g., peanuts, penicillin)"
                  onKeyPress={(e) => e.key === 'Enter' && addToList('allergies', newAllergy)}
                />
                <Button 
                  onClick={() => addToList('allergies', newAllergy)}
                  disabled={!newAllergy.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {profileData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-sm">
                      {allergy}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 hover:bg-transparent"
                        onClick={() => removeFromList('allergies', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Add current medication"
                  onKeyPress={(e) => e.key === 'Enter' && addToList('currentMedications', newMedication)}
                />
                <Button 
                  onClick={() => addToList('currentMedications', newMedication)}
                  disabled={!newMedication.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {profileData.currentMedications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.currentMedications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {medication}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 hover:bg-transparent"
                        onClick={() => removeFromList('currentMedications', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Read-only Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Email Address (Cannot be changed)</Label>
                <Input
                  value={patient.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support if you need to change your email address
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={loading} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}