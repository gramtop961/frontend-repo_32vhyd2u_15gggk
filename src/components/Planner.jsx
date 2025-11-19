import { useMemo, useState } from 'react'

const fmt = (s) => new Date(s).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

export default function Planner({ backend }) {
  const [scenario, setScenario] = useState(() => ({
    id: 'demo-1',
    name: 'Demo Corridor',
    trains: [
      {
        id: 'P1', service_type: 'passenger', priority: 8, origin: 'A', destination: 'D',
        planned_departure: new Date(Date.now() + 2*60*1000).toISOString(),
        route: ['S1','S2','S3']
      },
      {
        id: 'F7', service_type: 'freight', priority: 4, origin: 'A', destination: 'D',
        planned_departure: new Date(Date.now() + 5*60*1000).toISOString(),
        route: ['S1','S2','S3']
      }
    ],
    incidents: [],
    overrides: { fixed_enters: [] }
  }))

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const optimize = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${backend}/api/optimize`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ scenario })
      })
      if (!res.ok) throw new Error(`Optimize failed ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const whatIfDelay = async (trainId, minutes) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${backend}/api/whatif`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ scenario, delay_train_id: trainId, delay_minutes: minutes })
      })
      if (!res.ok) throw new Error(`What-if failed ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Scenario</h3>
          <div className="flex gap-2">
            <button onClick={optimize} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50" disabled={loading}>Optimize</button>
            <button onClick={() => whatIfDelay('P1', 5)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50" disabled={loading}>What-if: Delay P1 +5m</button>
          </div>
        </div>
        <div className="text-blue-200 text-sm">
          <p>Trains: {scenario.trains.map(t=>`${t.id} (prio ${t.priority})`).join(', ')}</p>
          <p className="mt-1">Objective: maximize throughput, minimize delay with safety headways.</p>
        </div>
        {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
      </div>

      {result && (
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Recommendation</h3>
          <p className="text-blue-200 text-sm mb-3">{result.explanation}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-blue-100 text-sm">
              <thead>
                <tr className="text-blue-300">
                  <th className="py-2 pr-4">Train</th>
                  <th className="py-2 pr-4">Section</th>
                  <th className="py-2 pr-4">Enter</th>
                  <th className="py-2 pr-4">Exit</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.legs.map((l, idx) => (
                  <tr key={idx} className="border-t border-blue-500/10">
                    <td className="py-2 pr-4">{l.train_id}</td>
                    <td className="py-2 pr-4">{l.section_id}</td>
                    <td className="py-2 pr-4">{fmt(l.enter_time)}</td>
                    <td className="py-2 pr-4">{fmt(l.exit_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-blue-200 text-sm">
            <p>Throughput (trains finished): {result.schedule.objective.throughput}</p>
          </div>
        </div>
      )}
    </div>
  )
}
