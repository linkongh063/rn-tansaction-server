import express from "express";
import { createTransaction, deleteTransaction, getTransactionById, getTransactions, getTransactionsSummary } from "../controllers/transactionsController.js";

const router = express.Router();

// Endpoint to get all transactions
router.get("/", getTransactions);

// Endpoint to post a new transaction
router.post("/", createTransaction);

// Endpoint to get a transaction by ID
router.get("/:id", getTransactionById)

// Endpoint to get transactions summary
router.get("/summary/:userId", getTransactionsSummary);

router.delete("/:id", deleteTransaction); 

export default router;