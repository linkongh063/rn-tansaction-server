import dotenv from "dotenv";
import express from "express";
import { initializeDatabase } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "../cron.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
// middlewares
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(rateLimiter);
// start cron job
if(process.env.NODE_ENV === "production") {
    job.start(); // Start the cron job if in production environment
}
// initialize the database

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running and healthy",
    });
});
app.get("/", (req, res) => {
    res.send("Hello, World 00!");
});

// Routes

app.use('/api/transactions', transactionsRoute);

// database connection
initializeDatabase()
    .then(() => {

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
        process.exit(1); // Exit the process if database initialization fails
    });
