import { sql } from "../config/db.js";

export async function getTransactions(req, res) {
    try {
        // Fetch all transactions from the database
        const transactions = await sql`SELECT * FROM transaction ORDER BY created_at DESC;`;

        // Return the transactions as JSON
        console.log("Transactions fetched:", transactions);
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createTransaction(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;
        // Validate input
        if (!user_id || !title || !amount || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Insert transaction into the database
        const result = await sql`
                INSERT INTO transaction (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *;
            `;

        // Return the created transaction
        console.log("Transaction created:", result[0]);
        res.status(201).json(result[0]);
    }
    catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getTransactionById(req, res) {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        // Fetch the transaction from the database
        const transaction = await sql`SELECT * FROM transaction WHERE user_id = ${id};`;

        // Check if transaction exists
        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Return the transaction as JSON
        console.log("Transaction fetched:", transaction);
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getTransactionsSummary(req, res) {
    try {
        const { userId } = req.params;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(AMOUNT), 0) AS balance
            FROM transaction
            WHERE user_id = ${userId};
            `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(AMOUNT), 0) AS income
            FROM transaction
            WHERE user_id = ${userId} AND amount > 0;
            `

        const expensesResult = await sql`
            SELECT COALESCE(SUM(AMOUNT), 0) AS income
            FROM transaction
            WHERE user_id = ${userId} AND amount < 0;
            `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].income,
        });
    }
    catch (error) {
        console.error("Error fetching transactions summary:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

 export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        // Validate ID
        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }
        // Delete the transaction from the database
        const result = await sql`DELETE FROM transaction WHERE id = ${id} RETURNING *;`;
        // Check if transaction was deleted
        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        // Return the deleted transaction
        console.log("Transaction deleted:", result[0]);
        res.status(200).json(result[0]);
    }
    catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}