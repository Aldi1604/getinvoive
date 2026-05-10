import prisma from "../config/prisma.js"

export const upgradeUser = async (req, res) => {
    const { userId } = req.body

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isPremium: true }
        })

        res.json(user)
    }   catch (err) {
        res.status(500).json({ message: "Upgrade gagal"})
    }
} 