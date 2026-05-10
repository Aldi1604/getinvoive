import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async () => {
    try {
      setError("")

      const res = await fetch("http://getinvoive-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      // langsung redirect ke login
      navigate("/")
    } catch (err) {
      setError("Terjadi error")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div className="bg-gray-800 p-8 rounded-2xl w-96">
        <h2 className="text-white text-2xl mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 p-3 rounded text-white hover:bg-green-600"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register