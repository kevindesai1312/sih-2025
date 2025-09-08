import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleMedicines } from "./routes/medicines";
import { handleSymptomCheck, getSymptomsList } from "./routes/symptoms";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/medicines", handleMedicines);
  app.post("/api/symptoms/check", handleSymptomCheck);
  app.get("/api/symptoms/list", getSymptomsList);

  return app;
}
