import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import invoiceRoutes from "./routes/invoiceRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors({
  origin: "*",
}))

app.use(express.json())

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/invoice", invoiceRoutes)
app.use("/api/payment", paymentRoutes)

// ROOT
app.get("/", (req, res) => {
  res.send("API RUNNING 🚀")
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})