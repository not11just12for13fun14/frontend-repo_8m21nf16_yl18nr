import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function InvoiceView(){
  const { token } = useParams()
  const [inv, setInv] = useState(null)
  const [paid, setPaid] = useState({ payment_date: new Date().toISOString().slice(0,10), payment_method:'bank transfer', amount_received: 0, payment_reference:'' })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => { (async () => {
    const r = await fetch(`${baseUrl}/api/invoice/${token}`)
    if (r.ok){
      const d = await r.json()
      setInv(d)
      setPaid(p => ({...p, amount_received: d.amount, payment_reference: d.payment_reference }))
    }
  })() }, [token])

  const markPaid = async () => {
    const r = await fetch(`${baseUrl}/api/invoice/${token}/paid`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(paid) })
    if (r.ok){
      alert('Marked as paid. Receipt generated. Use Print to save PDF.')
      const d = await r.json()
      setInv(i => ({...i, status:'paid', paid_at: paid.payment_date}))
    }
  }

  if (!inv) return <div className="p-6 text-white">Loading...</div>

  const emailMsg = `Hi ${inv.client_name},\n\nPlease find your invoice here: ${window.location.href}.\nPayment reference: ${inv.payment_reference}.\n\nThank you.`
  const waMsg = `Hi ${inv.client_name} — invoice link: ${window.location.href} — Reference: ${inv.payment_reference}`

  return (
    <div className="max-w-3xl mx-auto p-6 text-slate-100">
      <div className="bg-white/5 border border-white/10 rounded p-4">
        <h2 className="text-2xl font-bold">Invoice #{inv.invoice_number}</h2>
        <p className="text-sm text-slate-300">{inv.my_details?.name} • {inv.my_details?.email} • {inv.my_details?.phone}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p><strong>Bill To:</strong> {inv.client_name}</p>
            <p><strong>Project:</strong> {inv.project_name}</p>
            <p><strong>Date:</strong> {inv.invoice_date}</p>
            <p><strong>Due:</strong> {inv.due_date || 'Upon receipt'}</p>
          </div>
          <div>
            <p><strong>Amount:</strong> {inv.currency} {inv.amount}</p>
            <p><strong>Payment Ref:</strong> {inv.payment_reference}</p>
            <p><strong>Bank:</strong> {inv.bank_details?.bank}</p>
            <p><strong>Account:</strong> {inv.bank_details?.account}</p>
            <p><strong>Mobile Money:</strong> {inv.bank_details?.mobile_money}</p>
            <p><strong>SWIFT:</strong> {inv.bank_details?.swift}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={()=>window.print()} className="btn-secondary">Download PDF</button>
          {inv.status !== 'paid' && (
            <details className="ml-auto">
              <summary className="cursor-pointer text-sm text-slate-200">Mark as Paid</summary>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input className="input" type="date" value={paid.payment_date} onChange={e=>setPaid({...paid, payment_date:e.target.value})} />
                <select className="input" value={paid.payment_method} onChange={e=>setPaid({...paid, payment_method:e.target.value})}>
                  <option>bank transfer</option>
                  <option>mobile money</option>
                  <option>other</option>
                </select>
                <input className="input" type="number" placeholder="Amount received" value={paid.amount_received} onChange={e=>setPaid({...paid, amount_received:Number(e.target.value)})} />
                <input className="input" placeholder="Payment reference" value={paid.payment_reference} onChange={e=>setPaid({...paid, payment_reference:e.target.value})} />
                <button className="btn-primary col-span-2" onClick={markPaid}>Confirm Paid & Generate Receipt</button>
              </div>
            </details>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded border border-white/10">
        <h3 className="font-semibold">Share</h3>
        <p className="text-sm mt-2">Email message:</p>
        <pre className="text-xs bg-black/30 p-2 rounded whitespace-pre-wrap">{emailMsg}</pre>
        <p className="text-sm mt-2">WhatsApp message:</p>
        <pre className="text-xs bg-black/30 p-2 rounded whitespace-pre-wrap">{waMsg}</pre>
      </div>
    </div>
  )
}
