import express from "express"
import { createTransaction, handleWebhook } from "../controllers/paymentController.js"

const router = express.Router()

router.post("/create", createTransaction)
router.post("/webhook", handleWebhook)

export default router