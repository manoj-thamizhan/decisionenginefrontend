import React, { useContext, useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, Send, ArrowUpDown, ArrowRight, Info, ArrowLeft, LogOutIcon, HeartPulse, Pill, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'
import OneIcon from "./assets/1.svg";
import TwoIcon from "./assets/2.svg";
import ThreeIcon from "./assets/3.svg";
import FourIcon from "./assets/4.svg";
import { createWorkflow, patchWorkflow, getWorkflows, createChangeinvolved, getWorkflow, getOptionsforWorkflow } from './apiservice';
import { g } from 'framer-motion/client';
import { X } from "lucide-react";
import AppContext from './appcontext'
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

const QUESTIONS = [
  { id: 1, question: "Select the Health Authority", key: "health_authority" },
  { id: 2, question: "Specify the UDI Regulation applicable", key: "udi_regulation" },
  { id: 3, question: "Select the data Category", key: "category" },
  { id: 4, question: "Specify the Data Property", key: "data_property" },
  { id: 5, question: "Enter the Data Attribute (HA Field Name)", key: "data_attribute_ha_field_name" },
  { id: 6, question: "Enter the GUDE Field Name", key: "gude_field_name" },
  { id: 7, question: "Specify the JNJ UDI Data Element", key: "jnj_udi_data_element" },
  { id: 8, question: "Enter the GUDE Field Number", key: "gude_field_number" },
  { id: 9, question: "Specify the BUDI Attribute (EUDAMED-only)", key: "budi_attribute_eudamed_only" },
  { id: 10, question: "Specify the GS1 GTIN Trigger (100782299 Appendix B)", key: "gs1_gtin_trigger_100782299_appendix_b" },
  { id: 11, question: "Specify the Health Authority GTIN Trigger", key: "health_authority_gtin_trigger" },
  { id: 12, question: "Define the JJMT Use Directive", key: "jjmt_use_directive" },
  { id: 13, question: "Is this a Mandatory Field in Database?", key: "mandatory_field_in_database" },
  { id: 14, question: "Specify the Field Type", key: "field_type" },
  { id: 15, question: "Is Add Flag applicable?", key: "add_flag" },
  { id: 16, question: "Is Edit Flag applicable?", key: "edit_flag" },
  { id: 17, question: "Is Delete Flag applicable?", key: "delete_flag" },
  { id: 18, question: "Describe Change Conditions or Scenarios", key: "change_condition_or_scenarios" },
  { id: 19, question: "Provide any Additional Change Request Requirements", key: "additional_change_request_requirements" },
  { id: 20, question: "Add DRI Comments", key: "dri_comments" },
];

const baseItems = [
  ...QUESTIONS.map((q, index) => ({
    id: index,
    component: <QuestionSelector question_key={q.key} question_text={q.question} />,
    key: q.key,
  })),
  { id: 100, component: <NotifyWorkflowSummary />, key: "summary" },
  { id: 101, component: <NotifyWorkflowSummaryLast />, key: "final_summary" },
];

function getIndexFromKey(key, items = baseItems) {
  console.log(key)
  const index = (() => {
    if (!key) return -1;

    const paramParts = Array.isArray(key)
      ? key.map(String)
      : (typeof key === 'string' && key.includes(','))
        ? key.split(',').map(k => k.trim()).filter(Boolean)
        : [String(key)];

    return items.findIndex(item => {
      const itemKey = item.key;
      const itemParts = Array.isArray(itemKey)
        ? itemKey.map(String)
        : (typeof itemKey === 'string' && itemKey.includes(','))
          ? itemKey.split(',').map(k => k.trim()).filter(Boolean)
          : [String(itemKey)];
      return paramParts.some(p => itemParts.includes(p));
    });
  })();
  console.log('Derived index:', index);
  return index !== -1 ? index+1 : null; // returns null if key not found
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
            <LogOutIcon className='text-[#6A6A6A] ml-[5px]' size={24} />
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
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || '';
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getWorkflows({ search })

        if (response.success) {
          const transformedData = response.data.map(item => ({
            id: item.id,
            change_number: item.change_number || 'N/A',
            udi_fia_number: item.udr_fia_number || 'N/A',
            title: item.title || 'Untitled',
            region: item.region || 'Not specified',
            udi_database: 'Not specified',
            gtin_change: item.gtin_change || 'No',
            status: item.status || 'Pending Review',
            assessor: 'Not assigned',
            date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            product_type: item.product_type,
            product_category_unit: item.product_category_unit,
            product_category_level: item.product_category_level,
            gtin_evaluation: item.gtin_evaluation,
            has_udi_health_impact: item.has_udi_health_impact,
            has_impact_in_new_gtin: item.has_impact_in_new_gtin,
            created_at: item.created_at,
            updated_at: item.updated_at
          }))
          setData(transformedData)
        } else {
          setError(response.error || 'Failed to fetch workflows')
          setData(makeData())
        }
      } catch (err) {
        console.error('Error fetching workflows:', err)
        setError('Failed to fetch workflows')
        setData(makeData())
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [search])


 

  return (
    <div className="space-y-[32px]">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-500 mt-1">Showing fallback data</p>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

        <StatCard title="Total Workflows" number={data.length}>
          <img src={OneIcon} alt="Total Workflows" className="w-6 h-6" />
        </StatCard>

        <StatCard title="Pending Review" number={data.filter(d => d.status === 'Pending Review').length}>
          <img src={TwoIcon} alt="Pending Review" className="w-6 h-6" />
        </StatCard>

        <StatCard title="Rejected" number={data.filter(d => d.status === 'Rejected').length}>
          <img src={ThreeIcon} alt="Rejected" className="w-6 h-6" />
        </StatCard>

        <StatCard title="Completed" number={data.filter(d => d.status === 'Completed').length}>
          <img src={FourIcon} alt="Completed" className="w-6 h-6" />
        </StatCard>  </div>

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
              type="text"
              value={search}
              onChange={(e) => {
                setParams({ search: e.target.value })
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
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id || row.change_number} className="border-t border-[#E5E7EB] hover:bg-gray-50">
                  <td className="px-4 py-[20px] text-[12px] font-bold">{row.change_number || 'N/A'}</td>
                  <td className="px-4 py-[20px] text-[12px] font-bold">{row.udi_fia_number || 'N/A'}</td>
                  <td className="px-4 py-[20px] text-[12px]">{row.title || 'Untitled'}</td>
                  <td className="px-4 py-[20px] text-[12px]">{row.region || 'Not specified'}
                    <InfoTooltip text={row.region || 'Not specified'} />
                  </td>
                  <td className="px-4 py-[20px] text-[12px]">{row.udi_database || 'Not specified'}</td>
                  <td className="px-4 py-[20px] text-[12px]">{row.gtin_change || 'No'}</td>
                  <td className="px-4 py-[20px] text-[12px]">
                    {row.status}
                  </td>
                  <td className="px-4 py-[20px] text-[12px]">{row.assessor || 'Not assigned'}</td>
                  <td className="px-4 py-[20px] text-[12px]">{row.date || 'N/A'}</td>
                  <td className="px-4 py-[20px] flex gap-2">
                    <button className="border border-[#EFEFEF] rounded-[8px] px-3 py-1 text-sm">View</button>
                    <button className="border border-[#EFEFEF] rounded-[8px] px-3 py-1 text-sm">Edit</button>
                    <button className="border border-[#EFEFEF] rounded-[8px] px-3 py-1 text-sm">Export</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl">📋</div>
                    <div className="text-lg font-medium">No workflows found</div>
                    <div className="text-sm">Create a new workflow to get started</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  )
}









function QuestionSelector({ question_key , question_text}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowId = searchParams.get("workflow_id");
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const {options} = useContext(AppContext)

  const questionText =  question_text;
const optionsList = options?.[question_key] || [];
  // const optionsList =  ['sd','asd'] ;
  // console.log('Options for', options.options[question_key]);

  const goNext = () => {
    const params = new URLSearchParams(searchParams);
    const current = parseInt(params.get("step") || "1", 10) || 1;
    const next = current + 1;
    params.set("step", String(next));
    setSearchParams(params);
  };
  
  const goto = (next) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", String(next));
    setSearchParams(params);
  };
  const handleSelect = async (item) => {
    if (loading) return; 
    
    setSelectedOption(item); 
    
    if (!workflowId) {
      toast.error("Please create a workflow first before saving this step.");
      return;
    }
    
    setLoading(true); 
    
    try {
      const payload = {
        [question_key]: item,
      };

      const response = await patchWorkflow(payload, workflowId);

      if (response && (response.success || response.id)) {
        toast.success("Workflow updated successfully!");
        
        if (response.data?.least_distinct_field_in_modelb?.field) {
          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        } else if (response.data?.action_item) {
          const params = new URLSearchParams(searchParams);
          params.set("action", String(response.data.action_item));
          params.set("step", String(100));
          setSearchParams(params);
        } else {
          if (!response.data?.least_distinct_field_in_modelb?.field) {
            goNext();
          }
        }
      } else {
        toast.error("Failed to update workflow");
      }
    } catch (err) {
      console.error("Error updating workflow:", err);
      toast.error("Something went wrong while updating workflow.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-4xl mx-auto relative">
      <h2 className="text-lg font-medium mb-6">
        {questionText} {loading && "..."} 
      </h2>

      <div className="flex flex-col gap-3 relative">
        {optionsList.map((item) => (
          <div
            key={item}
            onClick={() => handleSelect(item)}
            className={`flex items-center gap-4 border border-gray-200 rounded-md px-4 py-3 bg-white cursor-pointer transition-all ${
              selectedOption === item ? "bg-blue-50 border-blue-400 shadow-md" : "hover:bg-gray-50"
            } ${loading ? "opacity-60 pointer-events-none" : ""}`} 
          >
            <input
              type="radio"
              name={question_key}
              checked={selectedOption === item}
              // onChange={() => handleSelect(item)} 
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-gray-800 font-medium flex-1">{item}</span>
            {selectedOption === item && (
              <ChevronDown size={18} className="text-blue-600 rotate-90" /> 
            )}
          </div>
        ))}
      </div>
      {/* Optional: Add a loading spinner or message */}
      {loading && (
        <p className="mt-4 text-center text-blue-600">Saving selection and determining next step...</p>
      )}
    </div>
  );
}




function NotifyWorkflowSummary() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 w-full">
      <h2 className="text-lg font-semibold mb-4">
        Notify Change Owner & Generate Workflow Summary
      </h2>

      <button
        className="flex items-center justify-center gap-2 bg-[#EB1700] text-white font-medium px-6 py-2 rounded-md shadow hover:bg-[#d01400] transition-all"
      >
        <Send size={16} />
        Send
      </button>

      <p className="text-sm text-gray-500 mt-3">
        Send Notification & Workflow Outcome Report
      </p>
    </div>
  );
}

function NotifyWorkflowSummaryLast() {
  const [searchParams] = useSearchParams();

  const details = {
    changeNumber: searchParams.get("changeNumber") || "CR-10234",
    gtinOutcome: searchParams.get("gtinOutcome") || "New GTIN Assigned",
    udiImpact: searchParams.get("udiImpact") || "Submitted to FDA GUDID",
    action: searchParams.get("action") || "Regulatory notified",
    status: searchParams.get("status") || "Completed",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 w-full">
      <h2 className="text-lg font-semibold mb-6">
        Notify Change Owner & Generate Workflow Summary
      </h2>

      {/* Info boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <InfoBox label="Change Number" value={details.changeNumber} />
        <InfoBox label="GTIN Change Outcome" value={details.gtinOutcome} />
        <InfoBox label="UDI HA Database Impact" value={details.udiImpact} />
        <InfoBox label="Action" value={details.action} />
        <InfoBox label="Status" value={details.status} />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="border border-gray-300 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-50 transition-all">
          Download Report
        </button>
        <button className="bg-[#EB1700] text-white font-medium px-5 py-2 rounded-md shadow hover:bg-[#d01400] transition-all">
          Notify Stakeholders
        </button>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-800 mt-1">{value}</div>
    </div>
  );
}



function EditorCanvas({ items: initialItems }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const items = baseItems;
  const { setOptions } = useContext(AppContext);

  const stepParam = parseInt(searchParams.get("step") || "1", 10)
  const active = Math.min(Math.max(stepParam - 1, 0), (items?.length || 0) - 1)


  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowDown") goNext()
      if (e.key === "ArrowUp") goPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [items.length])

    useEffect(() => {
      createWorkflow({}).then(res => {
        setSearchParams({ workflow_id: res.data.id, step: "1" })
        getOptionsforWorkflow(res.data.id).then(res => {setOptions(res.data || [])});
        
      });
  }, [])

  const goNext = () => {
    const next = Math.min(active + 1, items.length - 1)
    const params = Object.fromEntries(searchParams)
    params.step = String(next + 1) // keep URL step 1-based
    setSearchParams(params)
  }

  const goPrev = () => {
    const prev = Math.max(active - 1, 0)
    const params = Object.fromEntries(searchParams)
    params.step = String(prev + 1)
    setSearchParams(params)
  }

  // animation variants
  const variants = {
    finished: () => ({
      y: "-120%",
      scale: 0.85,
      opacity: 0,
      pointerEvents: "none",
      transition: { type: "spring", stiffness: 220, damping: 30 },
    }),
    active: () => ({
      y: "0%",
      scale: 1,
      opacity: 1,
      pointerEvents: "auto",
      transition: { type: "spring", stiffness: 200, damping: 18 },
    }),
    next: (custom) => ({
      y: custom === 1 ? 180 : 396,
      scale: custom === 1 ? 0.94 : 0.56,
      opacity: custom === 1 ? 0.7 : 0.35,
      pointerEvents: "none",
      transition: { type: "spring", stiffness: 180, damping: 20 },
    }),
  }

  return (
    <div className="h-[80vh] flex-1 rounded-[16px] border-[2px] border-[#EFEFEF] bg-white shadow flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-b-[2px] border-[#EFEFEF]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Step {stepParam || 1}</h3>
          <div className="flex gap-2">
            <button onClick={goPrev} className="flex items-center justify-center h-[36px] w-[36px] border-[#EFEFEF] border-[2px] rounded-[10px]"><ArrowLeft size={24} className="text-gray-500" /></button>
            <button onClick={goNext} className="flex items-center justify-center h-[36px] w-[36px] border-[#EFEFEF] border-[2px] rounded-[10px]"><ArrowRight size={24} className="text-gray-500" /></button>

          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 p-4 space-y-4 rounded-[16px] overflow-hidden bg-gray-50 relative"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="relative h-full w-full flex items-start justify-center">
          <div className="w-full max-w-3xl relative" style={{ height: "100%" }}>
            {items.map((it, i) => {
              const state = i < active ? "finished" : i === active ? "active" : "next"
              const dist = i - active
              const custom = dist === 1 ? 1 : 2

              return (
                <AnimatePresence key={it.id} initial={false}>
                  <motion.div
                    key={it.id}
                    custom={custom}
                    variants={variants}
                    initial={i < active ? "finished" : "next"}
                    animate={state}
                    exit="finished"
                    className={`absolute left-1/2 -translate-x-1/2 w-full ${i === active ? 'z-50' : 'z-10'}`}
                    style={{ top: "20px" }}
                    aria-hidden={i !== active}
                    transition={{ duration: 0.45 }}
                  >
                    {typeof it.component === "function" ? it.component() : it.component}
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




function AssessmentCards() {
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step") || "1"; // default to 1 if not present
  const step = parseInt(stepParam, 10) || 1;
  const { setOptions } = useContext(AppContext);

  // answers is a flat object returned by the API: { product_type: "...", region: "...", ... }
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    let isCancelled = false;


    async function fetchAnswers() {
      setLoading(true);
      setError(null);


      try {
        const wfid = searchParams.get("workflow_id");
        if (!wfid) return;;
        const res = await getWorkflow({ id: wfid });
        if (!res.success) throw new Error(`HTTP ${res.status}`);
        const data = res.data;
        


        // Accept either { answers: { ... } } or flat { ... }
        const payload = data && data.answers ? data.answers : data || {};


        if (!isCancelled) setAnswers(payload);
      } catch (err) {
        if (!isCancelled) setError(err.message || "Failed to fetch");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }


    fetchAnswers();


    return () => {
      isCancelled = true;
    };
  }, [stepParam]);


  const cardsToRender = QUESTIONS.map((q) => ({
    id: q.id,
    question: q.question,
    answer: answers[q.key] || "",
  }));


  return (
    <div className="max-w-md mx-auto p-4">
      {error && (
        <div className="mb-3 text-red-600 text-sm">Error loading answers: {error}</div>
      )}


      {cardsToRender.map((card, idx) => (
        <div key={card.id} className="flex flex-col items-center">
          <div className="w-full bg-white rounded-xl shadow p-4 mb-2 relative">
            <div className="flex gap-4 items-start">
              <div className="text-red-500 font-semibold">{String(card.id).padStart(2, "0")}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">{card.question}</div>
                <div className="mt-2 text-red-600 font-medium">{card.answer || (loading ? "Loading..." : "—")}</div>
              </div>
            </div>
          </div>


          {/* arrow except after last card */}
          {idx !== cardsToRender.length - 1 && (
            <div className="h-8 flex items-center" aria-hidden>
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v12" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11l5 5 5-5" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}


    </div>
  );
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
            <h3 className="font-semibold mb-1">Decision Workflow</h3>

          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            <AssessmentCards />
          </div>
        </div>

        {/* Elastic box */}
        <EditorCanvas />

      </div>
    </div>
  );
}
export default function App() {
  const navigate = useNavigate ? null : null
  const [options, setOptions] = useState({
    health_authority: [
        "FDA (US)",
        "EU (EUDAMED)",
        "Health Canada"
    ],
    udi_regulation: [
        "21 CFR Part 830 (GUDID)",
        "MDR 2017/745",
        "CMDR Amendments",
        "21 CFR Part 830"
    ],
    category: [
        "Device Identifier",
        "Product Info",
        "Device Info",
        "Packaging"
    ],
    data_property: [
        "Identification",
        "Manufacturer",
        "Commercial Distribution",
        "Packaging Level"
    ],
    data_attribute_ha_field_name: [
        "Primary DI Number",
        "Basic UDI-DI",
        "Company Name",
        "Commercial Distribution End Date",
        "UDI-PI (Lot/Serial)"
    ],
    gude_field_name: [
        "Device Identifier",
        "Basic UDI-DI",
        "Labeler Name",
        "Commercial Distribution End Date",
        "Production Identifier"
    ],
    jnj_udi_data_element: [
        "GTIN",
        "Basic Device ID",
        "Manufacturer Name",
        "Distribution End Date",
        "Serial / Lot Number"
    ],
    gude_field_number: [
        "1",
        "1.1",
        "2",
        "14",
        "3.2"
    ],
    budi_attribute_eudamed_only: [
        "–",
        "BUDI"
    ],
    gs1_gtin_trigger_100782299_appendix_b: [
        "New GTIN",
        "Option to use 502119016",
        "Not Included"
    ],
    health_authority_gtin_trigger: [
        "New GTIN",
        "Same GTIN"
    ],
    jjmt_use_directive: [
        "Rules-based",
        "Optional Use"
    ],
    mandatory_field_in_database: [
        "Yes",
        "No"
    ],
    field_type: [
        "Text (Numeric)",
        "Text (Alphanumeric)",
        "Text",
        "Date"
    ],
    add_flag: [
        "Yes",
        "No"
    ],
    edit_flag: [
        "Yes"
    ],
    delete_flag: [
        "No",
        "Yes"
    ],
    change_condition_or_scenarios: [
        "New version or model",
        "Device family change",
        "Rebranding / merger",
        "Product discontinued",
        "Packaging configuration change"
    ],
    additional_change_request_requirements: [
        "Approval via UDI Data Team",
        "Update BUDI linkage",
        "Notify via Licensing team",
        "Provide justification memo",
        "Documentation of change"
    ],
    dri_comments: [
        "Must align with GS1 allocation",
        "Basic UDI determines device family",
        "No GTIN change required",
        "Non-mandatory GUDID update",
        "Track serialization method"
    ],
    gtin_outcome_action: [
        "Issue new GTIN",
        "Issue new Basic UDI-DI",
        "Same GTIN"
    ],
    data_source_outcome_action: [
        "Sync to GUDID",
        "Upload to EUDAMED",
        "Update manufacturer record",
        "Update record only",
        "Update packaging data"
    ]
});
  const onLogout = () => {
    // simple mock handler
    toast.success('Logged out')
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] ">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <TopHeader onLogout={onLogout} />
      <AppContext.Provider value={{options,setOptions}}>
      <main className="max-w-7xl mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateRecord />} />
        </Routes>
      </main>
      </AppContext.Provider>
    </div>
  )
}

