import { RequestHandler } from "express";
import type { MedicineAvailability, MedicinesResponse } from "@shared/api";

const baseStock: MedicineAvailability[] = [
  { name: "Paracetamol 500mg", stock: 42, pharmacy: "Kisan Medical Store", pincode: "140301" },
  { name: "ORS Sachet", stock: 120, pharmacy: "HealthPlus Chemist", pincode: "140301" },
  { name: "Amoxicillin 250mg", stock: 0, pharmacy: "Village Care Pharmacy", pincode: "140307" },
  { name: "Cetirizine 10mg", stock: 15, pharmacy: "Sehat Pharmacy", pincode: "140307" },
  { name: "Insulin (10ml)", stock: 6, pharmacy: "District Hospital Counter", pincode: "140001" },
];

export const handleMedicines: RequestHandler = (req, res) => {
  const pincode = String(req.query.pincode || "").trim();
  const now = new Date().toISOString();
  const items = baseStock.filter((m) => !pincode || m.pincode === pincode);
  const response: MedicinesResponse = { updatedAt: now, items };
  res.json(response);
};
