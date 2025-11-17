import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function SignMOU(){
  const { token } = useParams()
  const navigate = useNavigate()
  const [mou, setMou] = useState(null)
  const [agree, setAgree] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => { (async () => {
    const r = await fetch(`${baseUrl}/api/mou/${token}`)
    if (r.ok) setMou(await r.json())
  })() }, [token])

  const sign = async () => {
    const r = await fetch(`${baseUrl}/api/mou/${token}/sign`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ agree, name, title }) })
    if (r.ok){
      alert('Signed! Download PDF via your browser print (Save as PDF).')
      navigate(`/sign/${token}`)
    }
  }

  if (!mou) return <div className="p-6 text-white">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6 text-slate-100">
      <h2 className="text-2xl font-bold mb-4">Memorandum of Understanding</h2>

      <div className="prose prose-invert max-w-none bg-white/5 p-4 rounded border border-white/10">
        <h3>Parties</h3>
        <p><strong>My details:</strong> {mou.my_details?.name} {mou.my_details?.contact? `– ${mou.my_details.contact}`:''}</p>
        <p><strong>Client:</strong> {mou.client_details?.client_name} {mou.client_details?.company? `(${mou.client_details.company})`:''} {mou.client_details?.contact? `– ${mou.client_details.contact}`:''}</p>

        <h3>Project</h3>
        <p><strong>{mou.project?.name}</strong></p>
        <p>{mou.project?.description}</p>

        <h3>Terms</h3>
        <ul>
          {Object.entries(mou.terms||{}).map(([k,v])=> <li key={k}><strong>{k.replace('_',' ').toUpperCase()}:</strong> {String(v)}</li>)}
        </ul>
      </div>

      <div className="mt-4 p-4 bg-white/5 rounded border border-white/10">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} /> I agree to the terms of this MOU.</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <button disabled={!agree || !name} className="btn-primary mt-3" onClick={sign}>Sign & Confirm</button>
        <p className="text-xs text-slate-300 mt-2">A note will be added that it was signed electronically with dates and names. Use your browser's Print → Save as PDF to download the signed MOU.</p>
      </div>
    </div>
  )
}
