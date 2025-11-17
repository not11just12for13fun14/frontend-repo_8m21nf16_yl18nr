import { useState } from 'react'

export default function MOUForm({ onCreated }) {
  const [form, setForm] = useState({
    my_details: { name: 'Dimiro Networks / 59 Shift' },
    client_details: { client_name: '', company: '', contact: '' },
    project: { name: '', description: '' },
    terms: {
      scope: '', timeline: '', total_fee: '', installments: '', retainer: '', meetings: '', payment_terms: '', late_fees: ''
    }
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
      const res = await fetch(`${baseUrl}/api/mou`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
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
          <input className="input mt-2" placeholder="Contact (email/phone)" value={form.my_details.contact||''} onChange={e=>update('my_details.contact', e.target.value)} />
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">Client details</h3>
          <input className="input" placeholder="Client name" value={form.client_details.client_name} onChange={e=>update('client_details.client_name', e.target.value)} />
          <input className="input mt-2" placeholder="Company" value={form.client_details.company} onChange={e=>update('client_details.company', e.target.value)} />
          <input className="input mt-2" placeholder="Contact person" value={form.client_details.contact} onChange={e=>update('client_details.contact', e.target.value)} />
        </div>
      </div>
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-white font-semibold mb-2">Project</h3>
        <input className="input" placeholder="Project name" value={form.project.name} onChange={e=>update('project.name', e.target.value)} />
        <textarea className="input mt-2" placeholder="Description" value={form.project.description} onChange={e=>update('project.description', e.target.value)} />
      </div>
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-white font-semibold mb-2">Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {['scope','timeline','total_fee','installments','retainer','meetings','payment_terms','late_fees'].map(k=> (
            <input key={k} className="input" placeholder={k.replace('_',' ').toUpperCase()} value={form.terms[k]} onChange={e=>update(`terms.${k}`, e.target.value)} />
          ))}
        </div>
      </div>
      <button disabled={loading} className="btn-primary w-full">{loading? 'Creating...' : 'Create MOU & Sign Link'}</button>
    </form>
  )
}
