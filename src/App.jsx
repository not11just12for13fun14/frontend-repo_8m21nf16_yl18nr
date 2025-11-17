import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import MOUForm from './components/MOUForm'
import InvoiceForm from './components/InvoiceForm'
import Snapshot from './components/Snapshot'
import SignMOU from './components/SignMOU'
import InvoiceView from './components/InvoiceView'

function Home(){
  const [mouResult, setMouResult] = useState(null)
  const [invResult, setInvResult] = useState(null)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Hero />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h2 className="text-xl font-bold mb-2">A. MOU creation + e-sign link</h2>
            <MOUForm onCreated={setMouResult} />
            {mouResult && (
              <div className="mt-3 text-sm bg-black/30 p-3 rounded">
                <p>MOU created. Share this sign link:</p>
                <Link className="text-blue-300 underline" to={`/sign/${mouResult.sign_url_token}`}>{window.location.origin + '/sign/' + mouResult.sign_url_token}</Link>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h2 className="text-xl font-bold mb-2">B. Invoice creation + view link</h2>
            <InvoiceForm onCreated={setInvResult} />
            {invResult && (
              <div className="mt-3 text-sm bg-black/30 p-3 rounded">
                <p>Invoice created. Share this view link:</p>
                <Link className="text-blue-300 underline" to={`/invoice/${invResult.view_url_token}`}>{window.location.origin + '/invoice/' + invResult.view_url_token}</Link>
              </div>
            )}
          </div>
        </div>

        <Snapshot />
      </div>
    </div>
  )
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign/:token" element={<SignMOU />} />
      <Route path="/invoice/:token" element={<InvoiceView />} />
    </Routes>
  )
}
