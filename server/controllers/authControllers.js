import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import prisma from "../config/prisma.js"

// sementara kita simpan di memory dulu (nanti pake database)
const users = []

export const register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib diisi" })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: "User sudah ada" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      message: "Register berhasil",
      user: { id: newUser.id, email: newUser.email },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib diisi" })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" })
    }

    res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getMe = async (req, res) => {
  const { userId } = req.query

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  res.json(user)
}