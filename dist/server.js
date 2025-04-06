"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Middlewares
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
// Configs 
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
// import 
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(logger_middleware_1.default);
console.log(process.env.GMAIL_HOST, process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);
const transporter = nodemailer_1.default.createTransport({
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
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error", err);
        }
        console.log("Email sent: ", info);
    });
    res.status(200).send("Mail successfully sent");
});
// Use session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUnintialized: false
}));
// Error handling middleware function
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(401).send("Unauthenticated!");
});
// initialize passport and session
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// API Routes
app.use("/api/auth", auth_routes_1.default);
// Postgres Configuration
dbConfig_1.default
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
//# sourceMappingURL=server.js.map