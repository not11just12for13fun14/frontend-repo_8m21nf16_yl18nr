import { useState } from 'react'

export default function InvoiceForm({ onCreated }) {
  const [form, setForm] = useState({
    my_details: { name: 'Dimiro Networks / 59 Shift', contact:'', phone:'', email:'' },
    client_name: '',
    project_name: '',
    invoice_number: '001',
    invoice_date: new Date().toISOString().slice(0,10),
    due_date: '',
    amount: 0,
    currency: 'USD',
    bank_details: { bank:'', account:'', mobile_money:'', swift:'', currency:'USD' },
    payment_reference: ''
  })
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const update = (path, value) => {
    const keys = path.split('.')
    setForm(prev => {
      const next = { ...prev }
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
      cur[keys[keys.length - 1]] = value
      return next
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/invoice`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      onCreated && onCreated(data)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">My details</h3>
          <input className="input" placeholder="Name" value={form.my_details.name} onChange={e=>update('my_details.name', e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <input className="input" placeholder="Contact" value={form.my_details.contact} onChange={e=>update('my_details.contact', e.target.value)} />
            <input className="input" placeholder="Phone" value={form.my_details.phone} onChange={e=>update('my_details.phone', e.target.value)} />
            <input className="input" placeholder="Email" value={form.my_details.email} onChange={e=>update('my_details.email', e.target.value)} />
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">Client & Project</h3>
          <input className="input" placeholder="Client name" value={form.client_name} onChange={e=>update('client_name', e.target.value)} />
          <input className="input mt-2" placeholder="Project name" value={form.project_name} onChange={e=>update('project_name', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">Invoice</h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Invoice #" value={form.invoice_number} onChange={e=>update('invoice_number', e.target.value)} />
            <input className="input" type="date" value={form.invoice_date} onChange={e=>update('invoice_date', e.target.value)} />
            <input className="input" type="date" value={form.due_date} onChange={e=>update('due_date', e.target.value)} />
            <input className="input" placeholder="Amount" type="number" value={form.amount} onChange={e=>update('amount', Number(e.target.value))} />
            <input className="input" placeholder="Currency" value={form.currency} onChange={e=>update('currency', e.target.value)} />
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">Bank details</h3>
          {['bank','account','mobile_money','swift','currency'].map(k => (
            <input key={k} className="input mt-2 first:mt-0" placeholder={k.replace('_',' ').toUpperCase()} value={form.bank_details[k]} onChange={e=>update(`bank_details.${k}`, e.target.value)} />
          ))}
        </div>
      </div>

      <input className="input" placeholder="Payment reference (e.g., [Client] – Invoice [#])" value={form.payment_reference} onChange={e=>update('payment_reference', e.target.value)} />

      <button disabled={loading} className="btn-primary w-full">{loading? 'Creating...' : 'Create Invoice & View Link'}</button>
    </form>
  )
}
