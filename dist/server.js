"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// utils
const logger_1 = __importDefault(require("./utils/logger"));
// Middlewares
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
// Configs 
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
// import 
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(logger_1.default);
// Use session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUnintialized: false
}));
// Error handling middleware function
// initialize passport and session
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// API Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
// Middleware to parse JSON
app.use(error_middleware_1.default);
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