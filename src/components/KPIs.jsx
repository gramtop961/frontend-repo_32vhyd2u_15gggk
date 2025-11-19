import { useEffect, useState } from 'react'

export default function KPIs({ backend }){
  const [kpi, setKpi] = useState(null)
  useEffect(() => { fetch(`${backend}/api/kpis`).then(r=>r.json()).then(setKpi).catch(()=>{}) }, [backend])
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-2">Performance</h3>
      {kpi ? (
        <div className="grid grid-cols-2 gap-4 text-blue-100 text-sm">
          <div>
            <p className="text-blue-300">Punctuality</p>
            <p className="text-2xl font-semibold">{Math.round(kpi.punctuality*100)}%</p>
          </div>
          <div>
            <p className="text-blue-300">Avg Delay</p>
            <p className="text-2xl font-semibold">{kpi.avg_delay_min} min</p>
          </div>
          <div>
            <p className="text-blue-300">Throughput</p>
            <p className="text-2xl font-semibold">{kpi.throughput_trains}</p>
          </div>
          <div>
            <p className="text-blue-300">Utilization S1/S2/S3</p>
            <p className="text-2xl font-semibold">{Object.values(kpi.section_utilization).map(v=>Math.round(v*100)+'%').join(' / ')}</p>
          </div>
        </div>
      ) : (
        <p className="text-blue-200 text-sm">Loading KPIs…</p>
      )}
    </div>
  )
}
