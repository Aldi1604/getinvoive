import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import logo from "../assets/logo.png"

function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`http://getinvoive-production.up.railway.app/api/invoice/${id}`)
        const data = await res.json()
        setInvoice(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchInvoice()
  }, [id])

  const downloadPDF = async () => {
    const element = document.getElementById("invoice")

    if (!element) {
        alert("Invoice tidak ditemukan")
        return
    }

    let eatermark

    let watermark

if (!user?.isPremium) {
  watermark = document.createElement("div")
  watermark.innerText = "GetInvoice FREE"
  watermark.style.position = "absolute"
  watermark.style.top = "50%"
  watermark.style.left = "50%"
  watermark.style.transform = "translate(-50%, -50%)"
  watermark.style.fontSize = "40px"
  watermark.style.opacity = "0.2"
  watermark.style.pointerEvents = "none"

  element.appendChild(watermark)
}

    //class khusus pdf
    element.classList.add("pdf-mode")

    const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff"
        
    })

    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0)
    pdf.save("invoice.pdf")

    element.classList.remove("pdf-mode")

    if (watermark) {
        element.removeChild(watermark)
    }
  }

  if (!invoice) {
    return <p className="text-white p-6">Loading...</p>
  }


 return (
  <div className="min-h-screen bg-gray-900 text-white p-6">

    {/* TOP BAR */}
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <button
        onClick={downloadPDF}
        className="bg-green-500 px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>

    {/* CENTER */}
    <div className="flex justify-center">

      {/* INVOICE CARD */}
      <div
        id="invoice"
        className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg"
      >

        {/* brand */}
        <div className="flex items-center gap-3 mb-6">
            <img
              src={logo}
              alt="logo"
              className="w-10 h-10 object-contain rounded"
            />
            <div>
                <h1 className="text-2xl font-bold">GetInvoice</h1>
                <p className="text-gray-400 text-sm">
                    Professional Invoice
                </p>
            </div>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6 border-t border-gray-700 pt-4">
          <div>
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-gray-400">
              Client: {invoice.clientName}
            </p>
          </div>

          <div className="text-right text-sm text-gray-400">
            <p>ID: {invoice?.id?.slice(0, 8).toUpperCase()}</p>
            <p>{new Date().toLocaleDateString("id-ID")}</p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="border-t border-gray-700">
          {invoice.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-gray-700"
            >
              <span>{item.name}</span>
              <span>Rp {item.price}</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4 text-right text-lg font-bold">
          Total: Rp {invoice.total}
        </div>

      </div>
    </div>
  </div>
)
}

export default InvoiceDetail