import express from "express"
import { upgradeUser } from "../controllers/userController.js"

const router = express.Router()

router.post("/upgrade", upgradeUser)

export default router