import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      setError("")

      const res = await fetch("http://localhost:5000/api/auth/login", {
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

      // simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user))

      // redirect ke dashboard (nanti kita bikin)
      navigate("/dashboard")
    } catch (err) {
      setError("Terjadi error")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-2xl w-96"
      >
        <h2 className="text-white text-2xl mb-6 text-center">
          Welcome Back
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
          onClick={handleLogin}
          className="w-full bg-blue-500 p-3 rounded text-white hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login