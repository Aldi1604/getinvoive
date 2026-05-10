import prisma from "../config/prisma.js"

// =======================
// CREATE INVOICE
// =======================
export const createInvoice = async (req, res) => {
  try {
    const { userId, clientName, total } = req.body

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(400).json({ error: "User tidak ditemukan" })
    }

    // ⏳ cek premium expired
    if (user.premiumUntil && new Date() > user.premiumUntil) {
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: false, premiumUntil: null },
      })
      user.isPremium = false
    }

    // 🚫 limit FREE (5 per bulan)
    if (!user.isPremium) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const count = await prisma.invoice.count({
        where: {
          userId,
          createdAt: {   // 🔥 FIX TYPO (tadi createAt)
            gte: startOfMonth,
          },
        },
      })

      if (count >= 5) {
        return res.status(403).json({
          error: "Limit FREE habis, Silahkan upgrade ke Premium",
        })
      }
    }

    // ✅ create invoice
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        clientName,
        total,
      },
    })

    res.json(invoice)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
  }
}

// =======================
// GET ALL INVOICES
// =======================
export const getInvoices = async (req, res) => {
  try {
    const { userId } = req.query

    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(invoices)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Gagal ambil invoice" })
  }
}

// =======================
// GET BY ID
// =======================
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
    })

    if (!invoice) {
      return res.status(404).json({ error: "Invoice tidak ditemukan" })
    }

    res.json(invoice)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Gagal ambil invoice" })
  }
}