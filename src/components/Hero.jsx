import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <div className="relative w-full h-[360px] md:h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
      <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Deal Admin Hub</h1>
          <p className="mt-2 text-slate-200/80 text-sm md:text-base">Create MOUs, invoices, capture signatures, mark payments, and generate receipts — one deal at a time.</p>
        </div>
      </div>
    </div>
  )
}
