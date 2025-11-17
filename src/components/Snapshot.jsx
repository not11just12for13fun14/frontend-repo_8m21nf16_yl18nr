import { useState } from 'react'

export default function Snapshot(){
  const [client, setClient] = useState('')
  const [project, setProject] = useState('')
  const [snap, setSnap] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchSnap = async () => {
    const params = new URLSearchParams({ client_name: client, project_name: project })
    const r = await fetch(`${baseUrl}/api/deal/snapshot?${params.toString()}`)
    if (r.ok) setSnap(await r.json())
    else setSnap(null)
  }

  return (
    <div className="p-4 bg-white/5 rounded border border-white/10">
      <h3 className="text-white font-semibold mb-2">Deal Snapshot</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input className="input" placeholder="Client name" value={client} onChange={e=>setClient(e.target.value)} />
        <input className="input" placeholder="Project name" value={project} onChange={e=>setProject(e.target.value)} />
        <button className="btn-secondary" onClick={fetchSnap}>Load</button>
      </div>
      {snap && (
        <div className="mt-3 text-slate-100 text-sm">
          <p><strong>Client:</strong> {snap.client_name}</p>
          <p><strong>Project:</strong> {snap.project_name}</p>
          <p><strong>MOU:</strong> {snap.mou.status} {snap.mou.link && (<a className="text-blue-300 underline ml-2" href={snap.mou.link}>Sign Link</a>)}</p>
          <p><strong>Invoice:</strong> {snap.invoice.status} {snap.invoice.link && (<a className="text-blue-300 underline ml-2" href={snap.invoice.link}>View Link</a>)}</p>
          <p><strong>Receipt:</strong> {snap.receipt_available? 'Available' : 'Not yet'}</p>
          {snap.next_step && <p className="mt-2 text-amber-300">{snap.next_step}</p>}
        </div>
      )}
    </div>
  )
}
