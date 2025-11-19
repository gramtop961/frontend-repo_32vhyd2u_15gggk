import Header from './components/Header'
import Planner from './components/Planner'
import KPIs from './components/KPIs'

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative min-h-screen px-6 py-10 max-w-5xl mx-auto">
        <Header />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Planner backend={backend} />
          </div>
          <div className="md:col-span-1">
            <KPIs backend={backend} />
          </div>
        </div>
        <div className="mt-8 text-center text-blue-300/70 text-sm">
          <p>Use Optimize to get recommended timings. Try a what-if delay to see rapid re-optimization. Controllers can override via fixed entries in the scenario.</p>
        </div>
      </div>
    </div>
  )
}

export default App
