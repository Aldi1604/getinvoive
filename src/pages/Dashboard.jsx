import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [invoices, setInvoices] = useState([])

  // redirect kalau belum login
  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user, navigate])

  // fetch invoice
  useEffect(() => {
  const refreshUser = async () => {
    try {
      const res = await fetch(`https://getinvoive-production.up.railway.app/api/auth/me?userId=${user.id}`)
      const data = await res.json()

      // cek kalau berubah jadi premium
      if (data.isPremium && !user.isPremium) {
        localStorage.setItem("user", JSON.stringify(data))
        window.location.reload()
      }

    } catch (err) {
      console.log(err)
    }
  }

  if (user) {
    refreshUser()
  }
}, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-bold">GetInvoice</h1>

        <div className="flex items-center gap-3">
          <span>{user?.email}</span>

          <span
            className={`px-2 py-1 text-xs rounded ${
              user?.isPremium
                ? "bg-yellow-500 text-black"
                : "bg-gray-600"
            }`}
          >
            {user?.isPremium ? "PRO" : "FREE"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl mb-4">Dashboard</h2>

        {/* UPGRADE */}
        {!user?.isPremium && (
          <div className="bg-yellow-500 text-black p-4 rounded mb-4 flex justify-between items-center">
            <span>Upgrade ke Premium (Rp 50.000)</span>

            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={async () => {
                try {
                  const res = await fetch(
                    "https://getinvoive-production.up.railway.app/api/payment/create",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ userId: user.id }),
                    }
                  )

                  const data = await res.json()
                  console.log("PAYMENT RESPONSE:", data)

                  if (!data.redirect_url) {
                    alert("Redirect URL kosong!")
                    return
                  }

                  // redirect ke Midtrans
                  window.location.href = data.redirect_url

                } catch (err) {
                  console.log("PAYMENT ERROR:", err)
                  alert("Gagal connect ke server")
                }
              }}
            >
              Upgrade
            </button>
          </div>
        )}

        {/* LIST INVOICE */}
        {invoices.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-xl">
            <p>Belum ada invoice</p>
            <p className="text-sm text-gray-400 mt-2">
              Yuk buat invoice pertama kamu
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => navigate(`/invoice/${inv.id}`)}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
              >
                <h3 className="font-bold">{inv.clientName}</h3>
                <p>Total: Rp {inv.total}</p>
              </div>
            ))}
          </div>
        )}

        {/* BUTTON CREATE */}
        <button
          onClick={() => navigate("/create-invoice")}
          className="mt-6 bg-blue-500 px-4 py-2 rounded"
        >
          + Buat Invoice
        </button>
      </div>
    </div>
  )
}

export default Dashboard