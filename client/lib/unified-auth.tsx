import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { z } from "zod";

export type UserRole = "patient" | "doctor" | "guest";

export type UnifiedUser = {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  profile?: any; // Additional profile data specific to role
  token?: string; // JWT token for backend authentication
};

type UnifiedAuthCtx = {
  user: UnifiedUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  registerPatient: (patientData: any) => Promise<void>;
  registerDoctor: (doctorData: any) => Promise<void>;
  guestLogin: (name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isPatient: boolean;
  isDoctor: boolean;
  isGuest: boolean;
};

const UnifiedAuthContext = createContext<UnifiedAuthCtx | null>(null);

const USERS_KEY = "unified_auth_users_v1";
const SESSION_KEY = "unified_auth_session_v1";

async function hash(input: string) {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UnifiedUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  async function login(email: string, password: string, role: UserRole) {
    try {
      // For patient and doctor roles, authenticate with the backend
      if (role === "patient" || role === "doctor") {
        const endpoint = role === "patient" ? "/api/patient/login" : "/api/doctor/login";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Authentication failed");
        }
        
        const data = await response.json();
        const userData = role === "patient" ? data.patient : data.doctor;
        
        const unifiedUser: UnifiedUser = {
          id: userData._id || userData.id,
          email: userData.email,
          name: userData.name,
          role: role,
          profile: userData,
          token: data.token
        };
        
        setUser(unifiedUser);
        return;
      }
      
      // Fallback to local authentication for testing
      const db: Record<string, any> = JSON.parse(
        localStorage.getItem(USERS_KEY) || "{}",
      );
      
      const userKey = `${role}_${email.toLowerCase()}`;
      const rec = db[userKey];
      
      if (!rec) throw new Error("Account not found");
      
      const hp = await hash(password);
      if (rec.hash !== hp) throw new Error("Invalid credentials");
      
      const unifiedUser: UnifiedUser = {
        id: rec.id,
        email: rec.email,
        name: rec.name,
        role: role,
        profile: rec.profile || {}
      };
      
      setUser(unifiedUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function registerPatient(patientData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    emergencyContact: any;
    bloodGroup?: string;
    medicalHistory?: string[];
    allergies?: string[];
    currentMedications?: string[];
  }) {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().min(10),
    });
    
    schema.parse(patientData);
    
    try {
      // Register with backend
      const response = await fetch("/api/patient/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      
      const data = await response.json();
      
      const unifiedUser: UnifiedUser = {
        id: data.patient._id || data.patient.id,
        email: data.patient.email,
        name: data.patient.name,
        role: "patient",
        profile: data.patient,
        token: data.token
      };
      
      setUser(unifiedUser);
    } catch (error) {
      // Fallback to local storage for offline functionality
      console.warn('Backend registration failed, falling back to local storage:', error);
      
      const emailNorm = patientData.email.toLowerCase();
      const db: Record<string, any> = JSON.parse(
        localStorage.getItem(USERS_KEY) || "{}",
      );
      
      const userKey = `patient_${emailNorm}`;
      if (db[userKey]) throw new Error("Email already registered");
      
      const hp = await hash(patientData.password);
      const rec = {
        id: crypto.randomUUID(),
        name: patientData.name,
        email: emailNorm,
        hash: hp,
        role: "patient" as const,
        profile: {
          phone: patientData.phone,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          address: patientData.address,
          emergencyContact: patientData.emergencyContact,
          bloodGroup: patientData.bloodGroup,
          medicalHistory: patientData.medicalHistory || [],
          allergies: patientData.allergies || [],
          currentMedications: patientData.currentMedications || []
        },
        createdAt: Date.now(),
      };
      
      db[userKey] = rec;
      localStorage.setItem(USERS_KEY, JSON.stringify(db));
      
      const unifiedUser: UnifiedUser = {
        id: rec.id,
        email: rec.email,
        name: rec.name,
        role: "patient",
        profile: rec.profile
      };
      
      setUser(unifiedUser);
    }
  }

  async function registerDoctor(doctorData: {
    username: string;
    password: string;
    name: string;
    specialization: string;
    email: string;
    phone: string;
  }) {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      username: z.string().min(3),
      specialization: z.string().min(2),
    });
    
    schema.parse(doctorData);
    
    try {
      // Register with backend
      const response = await fetch("/api/doctor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(doctorData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      
      const data = await response.json();
      
      const unifiedUser: UnifiedUser = {
        id: data.doctor._id || data.doctor.id,
        email: data.doctor.email,
        name: data.doctor.name,
        role: "doctor",
        profile: data.doctor,
        token: data.token
      };
      
      setUser(unifiedUser);
    } catch (error) {
      // Fallback to local storage for offline functionality
      console.warn('Backend registration failed, falling back to local storage:', error);
      
      const emailNorm = doctorData.email.toLowerCase();
      const db: Record<string, any> = JSON.parse(
        localStorage.getItem(USERS_KEY) || "{}",
      );
      
      const userKey = `doctor_${emailNorm}`;
      if (db[userKey]) throw new Error("Email already registered");
      
      const hp = await hash(doctorData.password);
      const rec = {
        id: crypto.randomUUID(),
        name: doctorData.name,
        email: emailNorm,
        hash: hp,
        role: "doctor" as const,
        profile: {
          username: doctorData.username,
          specialization: doctorData.specialization,
          phone: doctorData.phone
        },
        createdAt: Date.now(),
      };
      
      db[userKey] = rec;
      localStorage.setItem(USERS_KEY, JSON.stringify(db));
      
      const unifiedUser: UnifiedUser = {
        id: rec.id,
        email: rec.email,
        name: rec.name,
        role: "doctor",
        profile: rec.profile
      };
      
      setUser(unifiedUser);
    }
  }

  function guestLogin(name: string = "Guest User") {
    const guestUser: UnifiedUser = {
      id: `guest_${Date.now()}`,
      name: name,
      role: "guest",
      profile: {}
    };
    
    setUser(guestUser);
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    login,
    registerPatient,
    registerDoctor,
    guestLogin,
    logout,
    isAuthenticated: !!user,
    isPatient: user?.role === "patient",
    isDoctor: user?.role === "doctor",
    isGuest: user?.role === "guest",
  }), [user]);

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
}

export function useUnifiedAuth() {
  const ctx = useContext(UnifiedAuthContext);
  if (!ctx) throw new Error("useUnifiedAuth must be used within UnifiedAuthProvider");
  return ctx;
}