"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./entities/User");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
// Routes
app.use("/api/users", userRoutes_1.default);
// Setup database connection
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User_1.User],
    synchronize: true,
    logging: true,
});
// Debug log to confirm env values are loaded (optional)
console.log("Connecting to DB with:");
console.log("  DB_USER:", process.env.DB_USER);
console.log("  DB_NAME:", process.env.DB_NAME);
// Initialize DB and start server
exports.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(3001, () => console.log("🚀 Server running on http://localhost:3001"));
})
    .catch((error) => {
    console.error("❌ Database connection failed:", error);
});
