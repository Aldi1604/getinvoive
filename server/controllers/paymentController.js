import { snap } from "../config/midtrans.js"
import prisma from "../config/prisma.js"

export const createTransaction = async (req, res) => {
  try {
    const { userId } = req.body

    const orderId = `INV-${userId.slice(0, 6)}-${Date.now()}`

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 50000,
      },
      customer_details: {
        first_name: "User",
      },
      callbacks: {
        finish: "https://getinvoice.my.id/dashboard",
        error: "https://getinvoice.my.id/dashboard",
        pending:"https://getinvoice.my.id/dashboard"
      },
      custom_field1: userId,
    }

    const transaction = await snap.createTransaction(parameter)

    console.log("MIDTRANS FULL RESPONSE:", transaction)

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    })

  } catch (err) {
    console.log("ERROR MIDTRANS:", err)
    res.status(500).json({ error: "Gagal buat transaksi" })
  }
}

export const handleWebhook = async (req, res) => {
  try {
    const notif = req.body

    const orderId = notif.order_id
    const status = notif.transaction_status
    const userId = notif.custom_field1

    console.log("WEBHOOK MASUK", req.body)

    if (status === "settlement" || status === "capture") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      console.log("USER UPGRADED:", userId)
    }

    res.json({ message: "ok" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Webhook error" })
  }
}