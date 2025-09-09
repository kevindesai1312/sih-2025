import "dotenv/config";
import express from "express";
import cors from "cors";
import database from "./config/database";
import { SeedService } from "./services/database";
import { handleDemo } from "./routes/demo";
import { handleMedicines } from "./routes/medicines";
import { handleSymptomCheck, getSymptomsList } from "./routes/symptoms";
import { 
  handleDatabaseHealth, 
  handleAnalytics, 
  handleMedicineSearch,
  handleSymptomSearch,
  handlePharmacies,
  handleAddMedicine
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Initialize database connection
  database.connect().then(async () => {
    // Seed initial data if needed
    try {
      await SeedService.seedInitialData();
    } catch (error) {
      console.warn('Warning: Could not seed initial data:', error);
    }
  }).catch(error => {
    console.error('Failed to connect to database:', error);
    // Application can still run without database for basic functionality
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Core application routes
  app.get("/api/demo", handleDemo);
  app.get("/api/medicines", handleMedicines);
  app.post("/api/symptoms/check", handleSymptomCheck);
  app.get("/api/symptoms/list", getSymptomsList);

  // Database and admin routes
  app.get("/api/health/database", handleDatabaseHealth);
  app.get("/api/analytics", handleAnalytics);
  app.get("/api/medicines/search", handleMedicineSearch);
  app.get("/api/symptoms/search", handleSymptomSearch);
  app.get("/api/pharmacies", handlePharmacies);
  app.post("/api/medicines", handleAddMedicine);

  return app;
}
