import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
dotenv.config();

import authRoute from "./routes/authRoute.js";
import jobRoute from "./routes/jobRoute.js";
import userRoute from "./routes/userRoute.js";
import applicationRoute from "./routes/applicationRoute.js";
import { checkAuth } from "./middleware/checkAuth.js";
import { getAllCount } from "./controller/authController.js";
import { swaggerSpec } from "./swagger.js";
import { checkIsAdmin } from "./middleware/checkIsAdmin.js";

const app = express();

mongoose.connect(process.env.URI);

// Server Configuration
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Swagger endpoint
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// API routes
app.use("/auth", authRoute);
app.use("/jobs", jobRoute);
app.use("/applications", applicationRoute);
app.use("/users", userRoute);
app.get("/count", checkAuth, checkIsAdmin, getAllCount);

// Throw error for wrong URL
app.use((_req, _res) => {
  const error = new HttpError("Page not found", 404);
  throw error;
});

// Error handling
app.use((error, _req, res, next) => {
  if (res.headerSent) return next(error);
  res.status(error?.code || 500);
  res.json({ message: error.message || "An error occured" });
});

app.listen(process.env.PORT, () => console.log("Server listening"));
