import express from 'express';
import "dotenv/config";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

// Routes
import AuthRoutes from "./routes/auth.routes";

// Middlewares
import logger from "./middlewares/logger.middleware";

// Configs 
import psql from "./config/dbConfig";

// import 
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger);

console.log(process.env.GMAIL_HOST, process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});


app.post("/send-mail", (req, res) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "josephibok75@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!"
  }
  
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error", err)
    }
  
    console.log("Email sent: ", info)
  });
  
  res.status(200).send("Mail successfully sent");
})

// Use session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUnintialized: false
  })
)

// Error handling middleware function
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(401).send("Unauthenticated!");
});

// initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", AuthRoutes);

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
