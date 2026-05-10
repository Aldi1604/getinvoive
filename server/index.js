import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import invoiceRoutes from "./routes/invoiceRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: "https://getinvoice.my.id",
  credentials: true
}))
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/invoice", invoiceRoutes)
app.use("/api/user", userRoutes)
app.use("/api/payment", paymentRoutes)

app.get("/", (req, res) => {
  res.send("API aktif")
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(process.env.DATABASE_URL)
})