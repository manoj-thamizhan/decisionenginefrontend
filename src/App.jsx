import React, { useMemo, useState ,useEffect} from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, ArrowUpDown, ArrowRight, ArrowLeft, LogOutIcon } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'

// NOTE: This single-file component is meant to be dropped into a Tailwind + React project.
// Install dependencies: react-router-dom, @tanstack/react-table
function InfoTooltip({ text }) {
  return (
    <div className="relative inline-block group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 inline text-gray-400 ml-1 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>

      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        {text}
      </div>
    </div>
  )
}

function TopHeader({ onLogout }) {
  return (
    <header className="w-full bg-white shadow-[0px_2px_20px_2px_#0000000A] px-4 py-3 mb-[26px] ">
      <div className='max-w-7xl mx-auto  flex items-center justify-between'>

      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Decision Engine</h1>
      </div>

      <div className="flex items-center gap-3">
        
        <div className="flex items-center gap-2  border border-[#E5E7EB]  rounded-[12px] h-[48px] px-[8px]">
          <img
            src="https://api.dicebear.com/6.x/initials/svg?seed=JD" 
            alt="profile"
            className="w-[32px] h-[32px] shadow-[0px_6.55px_11.64px_0px_#00000033] rounded-full"
          />
            <span className="text-sm">John Doe</span>
        <LogOutIcon className='text-[#6A6A6A] ml-[5px]' size={24}/>
        </div>
      </div>
      </div>
    </header>
  )
}

function StatCard({ title, number, children }) {
  return (
    <div className="bg-white shadow-[0px_20px_40px_0px_#0206170A] border-[#E5E7EB] shadow rounded-[24px] p-[14px] flex items-center gap-3">
      <div className="w-[50px] h-[50px] flex items-center justify-center mr-[24px] rounded-[14px] shadow-[0px_11.36px_22.73px_0px_#00000014] bg-[#D0D0D278]">{children}</div>
      <div>
        <div className="text-sm text-[#6A6A6A] font-medium">{title}</div>
        <div className="text-xl font-bold">{number}</div>
      </div>
    </div>
  )
}

const makeData = () => {
  return [
    {
      change_number: '#CR-10234',
      udi_fia_number: '#CR-10234',
      title: 'MRI Label Update',
      region: 'EU',
      udi_database: 'EU MDR',
      gtin_change: 'Yes',
      status: 'Completed',
      assessor: 'Sarah Jenkins',
      date: '2025-09-22',
    },
    {
      change_number: '#CR-10212',
      udi_fia_number: '#CR-10212',
      title: 'Barcode Reclassification',
      region: 'Monaco',
      udi_database: 'ANVISA',
      gtin_change: 'No',
      status: 'Completed',
      assessor: 'Leo Martinez',
      date: '2025-09-17',
    },
    {
      change_number: '#CR-10289',
      udi_fia_number: '#CR-10289',
      title: 'Trade Name Merge',
      region: 'APAC',
      udi_database: 'PMDA',
      gtin_change: 'Yes',
      status: 'Pending Review',
      assessor: 'Rina Tanaka',
      date: '2025-08-30',
    },
    {
      change_number: '#CR-10078',
      udi_fia_number: '#CR-10078',
      title: 'Device Packaging Change',
      region: 'North America',
      udi_database: 'FDA 21 CFR',
      gtin_change: 'No',
      status: 'Rejected',
      assessor: 'Mark Reynolds',
      date: '2025-08-14',
    },
  ]
}
function Dashboard() {
  const [data, setData] = useState(() => makeData())
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10


  return (
    <div className="space-y-[32px]">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Workflows" number={data.length}><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" strokeWidth="2" stroke="currentColor"/></svg></StatCard>
        <StatCard title="Pending Review" number={data.filter(d=>d.status!=='Done').length}><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" strokeWidth="2" stroke="currentColor"/></svg></StatCard>
        <StatCard title="Rejected" number={data.filter(d=>d.status==='Done').length}><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeWidth="2" stroke="currentColor" /></svg></StatCard>
        <StatCard title="Completed" number={3}><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" strokeWidth="2" stroke="currentColor" /></svg></StatCard>
      </div>

      {/* Controls: search, filters, sort, CTA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        {/* New Workflow Button */}
        <Link
          to="/create"
          className="flex items-center gap-2 bg-[#EB1700] border border-[#EFEFEF] text-white px-6 py-2 rounded-[12px]"
        >
          <Plus size={16} />
          New Workflow
        </Link>

        {/* Search Input */}
        <div className="flex items-center border border-[#EFEFEF] bg-white rounded-[12px] px-3 py-2">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value)
              setPage(1)
            }}
            placeholder="Search"
            className="outline-none w-full"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {/* Sort Button */}
        <button className="flex items-center gap-2 border border-[#EFEFEF] bg-white rounded-[12px] px-3 py-2">
          <ArrowUpDown size={16} className="text-gray-500" />
          Sort
        </button>

        {/* Filter Button */}
        <button className="flex items-center gap-2 border border-[#EFEFEF] bg-white rounded-[12px] px-3 py-2">
          <Filter size={16} className="text-gray-500" />
          Filter
        </button>
      </div>
    </div>
      {/* Table */}
       <div className="bg-white border-[2px] border-[#EFEFEF] shadow rounded-[16px] min-h-[60vh] overflow-auto">
        <div className='flex justify-between pt-[22px] px-[24px] h-[80px]'>
          <h1 className=' text-[20px] font-medium leading-[100%] mt-[2px] ' >UDI FIA Workflows</h1>
          <div>
            <div className="flex gap-[32px]">
              <button className="flex items-center justify-center h-[36px] w-[36px] border-[#EFEFEF] border-[2px] rounded-[10px]"><ArrowLeft size={24} className="text-gray-500" /></button>
              <button className="flex items-center justify-center h-[36px] w-[36px] border-[#EFEFEF] border-[2px] rounded-[10px]"><ArrowRight size={24} className="text-gray-500" /></button>
            </div>
          </div>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-[#FAFAFA] border-t border-[#E5E7EB]">
            <tr>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">Change Number</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">UDI FIA Number</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">Title</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">Region / Country
              

              </th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">UDI HA Database</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">GTIN Change</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">Status</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">FIA Assessor</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">Date</th>
              <th className="text-left px-4 py-2 text-[#6B7280] text-[12px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-[#E5E7EB] hover:bg-gray-50">
                <td className="px-4 py-[20px] text-[12px] font-bold">{row.change_number}</td>
                <td className="px-4 py-[20px] text-[12px] font-bold">{row.udi_fia_number}</td>
                <td className="px-4 py-[20px] text-[12px]">{row.title}</td>
                <td className="px-4 py-[20px] text-[12px]">{row.region}
  <InfoTooltip text={row.region} />
                </td>
                <td className="px-4 py-[20px] text-[12px]">{row.udi_database}</td>
                <td className="px-4 py-[20px] text-[12px]">{row.gtin_change}</td>
                <td className="px-4 py-[20px] text-[12px]">
                  {row.status === 'Completed' && (
                    <span className="bg-[#D1FAE5] text-[#065F46] text-xs px-2 py-1 rounded-md">Completed</span>
                  )}
                  {row.status === 'Pending Review' && (
                    <span className="bg-[#FEF3C7] text-[#92400E] text-xs px-2 py-1 rounded-md">Pending Review</span>
                  )}
                  {row.status === 'Rejected' && (
                    <span className="bg-[#FEE2E2] text-[#991B1B] text-xs px-2 py-1 rounded-md">Rejected</span>
                  )}
                </td>
                <td className="px-4 py-[20px] text-[12px]">{row.assessor}</td>
                <td className="px-4 py-[20px] text-[12px]">{row.date}</td>
                <td className="px-4 py-[20px] flex gap-2">
                  <button className="border border-[#EFEFEF] rounded-[8px] px-3 py-1 text-sm">View</button>
                  <button className="border border-[#EFEFEF] rounded-[8px] px-3 py-1 text-sm">Edit</button>
                  <button className="border border-[#EFEFEF] rounded-[8px] px-3 py-1 text-sm">Export</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
  )
}




// EditorCanvas.jsx
// Drop this component in place of your dotted-area <div>.
// Requirements: framer-motion, TailwindCSS.
// Install: npm i framer-motion

function EditorCanvas({ items: initialItems }) {
  const items = initialItems || [
    { id: 1, title: 'Component A', body: 'Main settings for A' },
    { id: 2, title: 'Component B', body: 'Details about B' },
    { id: 3, title: 'Component C', body: 'More configuration' },
    { id: 4, title: 'Component D', body: 'Final touches' },
  ]

  const [active, setActive] = useState(0)

  // optional: keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, items.length - 1))
      if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items.length])

  function goNext() {
    setActive((a) => Math.min(a + 1, items.length - 1))
  }
  function goPrev() {
    setActive((a) => Math.max(a - 1, 0))
  }

  // variants for each logical state
  const variants = {
    finished: (custom) => ({
      y: '-120%',
      scale: 0.85,
      opacity: 0,
      pointerEvents: 'none',
      transition: { type: 'spring', stiffness: 220, damping: 30 },
    }),
    active: (custom) => ({
      y: '0%',
      scale: 1,
      opacity: 1,
      pointerEvents: 'auto',
      transition: { type: 'spring', stiffness: 200, damping: 18 },
    }),
    next: (custom) => ({
      y: custom === 1 ? 180 : 396,
      scale: custom === 1 ? 0.94 : 0.56,
      opacity: custom === 1 ? 0.7 : 0.35,
      pointerEvents: 'none',
      transition: { type: 'spring', stiffness: 180, damping: 20 },
    }),
  }

  return (
    <div className="h-[80vh] flex-1 rounded-[16px] border-[2px] border-[#EFEFEF] bg-white shadow flex flex-col">
      {/* Fixed header */}
      <div className="p-4 border-b border-b-[2px] border-[#EFEFEF] ">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Main Editor</h3>
          <div className="flex gap-2">
            <button onClick={goPrev} className="border px-3 py-1 rounded">
              Prev
            </button>
            <button onClick={goNext} className="bg-blue-600 text-white px-3 py-1 rounded">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Canvas area with dotted background */}
      <div
        className="flex-1 p-4 space-y-4 rounded-[16px] overflow-hidden bg-gray-50 relative"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* center stack container */}
        <div className="relative h-full w-full flex items-start justify-center">
          <div className="w-full max-w-3xl relative" style={{ height: '100%' }}>
            {items.map((it, i) => {
              // determine the logical state and a small "distance" value used by variants
              let state = 'next'
              let dist = i - active
              if (i < active) state = 'finished'
              else if (i === active) state = 'active'

              // custom will be used to slightly alter the next-state visuals for the immediate next vs others
              let custom = dist === 1 ? 1 : 2

              return (
                <AnimatePresence key={it.id} initial={false}>
                  <motion.div
                    key={it.id}
                    custom={custom}
                    variants={variants}
                    initial={i < active ? 'finished' : i === active ? 'next' : 'next'}
                    animate={state}
                    exit={'finished'}
                    className={`absolute left-1/2 -translate-x-1/2 w-full p-6 rounded-2xl shadow-lg bg-white border`}
                    style={{ top: '20px' }}
                    aria-hidden={i !== active}
                    transition={{ duration: 0.45 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">{it.title}</h4>
                        <p className="text-sm text-gray-500 mt-2">{it.body}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1 border rounded text-sm"
                          onClick={() => setActive(i)}
                        >
                          Focus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}




function CreateRecord() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        {/* Small box */}
        <div className="h-[80vh] w-72 rounded-[16px] bg-white shadow flex flex-col">
          {/* Fixed header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-1">Small Panel</h3>
            <p className="text-sm text-gray-600">
              This panel is narrow (fixed width) and scrollable.
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="p-2 border rounded">
                Field {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Elastic box */}
  <EditorCanvas/>

      </div>
    </div>
  );
}
export default function App() {
  const navigate = useNavigate ? null : null
  const onLogout = () => {
    // simple mock handler
    alert('Logged out')
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] ">
      <TopHeader onLogout={onLogout} />
      <main className="max-w-7xl mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateRecord />} />
        </Routes>
      </main>
    </div>
  )
}

