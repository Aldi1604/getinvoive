import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CreateInvoice() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [clientName, setClientName] = useState("")
  const [items, setItems] = useState([{ name: "", price: 0 }])

  const handleAddItem = () => {
    setItems([...items, { name: "", price: 0 }])
  }

  const handleChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = field === "price" ? Number(value) : value
    setItems(newItems)
  }

  const handleSubmit = async () => {
    const total = items.reduce((sum, item) => sum + item.price, 0)

    await fetch("http://getinvoive-production.up.railway.app/api/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName,
        items,
        total,
        userId: user.id,
      }),
    })

    navigate("/dashboard")
  }

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-xl mb-4">Buat Invoice</h1>

      <input
        placeholder="Nama Client"
        className="p-2 mb-4 w-full bg-gray-800"
        onChange={(e) => setClientName(e.target.value)}
      />

      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            placeholder="Item"
            className="p-2 bg-gray-800"
            onChange={(e) => handleChange(i, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Harga"
            className="p-2 bg-gray-800"
            onChange={(e) => handleChange(i, "price", e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleAddItem} className="bg-gray-700 px-3 py-1 mt-2">
        + Item
      </button>

      <br />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 px-4 py-2 mt-4"
      >
        Simpan Invoice
      </button>
    </div>
  )
}

export default CreateInvoice