import express from 'express';
import "dotenv/config";
import passport from "passport";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

// utils
import logger from "./utils/logger";

// Middlewares
import errorHandler from './middlewares/error.middleware';

// Configs 
import psql from "./config/dbConfig";

// import 
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger);
app.use(errorHandler);

// Use session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUnintialized: false
  })
)

// initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Postgres Configuration
psql
.connect()
.then(() => {
  console.log("Connected to PostgresSQL database");
})
.catch(err => {
  console.error("Error connecting to PostgresSQL database", err);
});

// Start App
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
