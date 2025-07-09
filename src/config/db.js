import { neon } from '@neondatabase/serverless';

import "dotenv/config";

// Initialize the Neon database connection using the DATABASE_URL from environment variables
export const sql = neon(process.env.DATABASE_URL);



export async function initializeDatabase() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transaction (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1); // Exit the process if database initialization fails
    }
}
