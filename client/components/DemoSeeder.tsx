import { useEffect } from "react";
import { useUnifiedAuth } from "@/lib/unified-auth";

// Demo data seeder component
export function DemoSeeder() {
  const { user } = useUnifiedAuth();

  useEffect(() => {
    // Only seed data if no user is logged in and localStorage doesn't have demo data
    if (!user && !localStorage.getItem("demo_seeded")) {
      seedDemoData();
    }
  }, [user]);

  const seedDemoData = async () => {
    try {
      // Create demo users in localStorage
      const demoUsers = {
        // Patient
        "patient_patient@test.com": {
          id: "patient-demo-1",
          name: "John Patient",
          email: "patient@test.com",
          hash: await hashPassword("test@123"), // This should match the hash for "test@123"
          role: "patient",
          profile: {
            phone: "+1234567890",
            dateOfBirth: "1990-01-01",
            gender: "male",
            address: "123 Main St, Healthcare City, HC 12345",
            emergencyContact: {
              name: "Jane Patient",
              phone: "+1234567891",
              relationship: "Spouse"
            },
            bloodGroup: "O+",
            medicalHistory: ["Hypertension", "Diabetes Type 2"],
            allergies: ["Penicillin", "Shellfish"],
            currentMedications: ["Metformin", "Lisinopril"]
          },
          createdAt: Date.now()
        },
        // Doctor
        "doctor_test@gmail.com": {
          id: "doctor-demo-1", 
          name: "Dr. Sarah Doctor",
          email: "test@gmail.com",
          hash: await hashPassword("test@123"),
          role: "doctor",
          profile: {
            username: "drsarah",
            specialization: "General Medicine",
            phone: "+1234567892"
          },
          createdAt: Date.now()
        }
      };

      localStorage.setItem("unified_auth_users_v1", JSON.stringify(demoUsers));
      localStorage.setItem("demo_seeded", "true");
      console.log("Demo data seeded successfully!");
    } catch (error) {
      console.error("Failed to seed demo data:", error);
    }
  };

  // Helper function to hash password (copied from unified-auth.tsx)
  const hashPassword = async (password: string) => {
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  return null; // This component doesn't render anything
}