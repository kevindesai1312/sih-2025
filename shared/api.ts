/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface MedicineAvailability {
  name: string;
  stock: number;
  pharmacy: string;
  pincode: string;
}

export interface MedicinesResponse {
  updatedAt: string; // ISO
  items: MedicineAvailability[];
}

export interface SymptomCheckInput {
  age: number;
  symptoms: string[];
  notes?: string;
}

export type TriageLevel = "self_care" | "pharmacist" | "doctor" | "urgent";

export interface SymptomCheckResult {
  level: TriageLevel;
  advice: string;
  redFlags: string[];
}
