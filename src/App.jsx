import React, { useMemo, useState ,useEffect} from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, ArrowUpDown, ArrowRight, Info,ArrowLeft, LogOutIcon,HeartPulse, Pill , ChevronDown } from "lucide-react"
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

function DemoCard({ title, body }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-gray-500 mt-2">{body}</p>
      </div>
    </div>
  )
}

function RegionCountrySelector() {
  const [showRegions, setShowRegions] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const regions = [
    "Asia Pacific (APAC)",
    "Europe (EU)",
    "Latin America (LATAM)",
    "Middle East & Africa (MEA)",
    "North America (NA)",
  ];

  const countries = [
    { code: "MC", name: "Monaco" },
    { code: "FR", name: "France" },
    { code: "US", name: "United States" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
  ];

  const toggleSelection = (item, selected, setSelected) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-5xl mx-auto relative">
      <h2 className="text-lg font-medium mb-6">
        Select Region/Country where products are distributed or intended to be distributed
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-center relative">
        {/* Region Search */}
        <div className="relative flex-1">
          <div
            onClick={() => {
              setShowRegions(!showRegions);
              setShowCountries(false);
            }}
            className="flex items-center border border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer"
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setShowRegions(true);
              }}
              placeholder="Search Region"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {showRegions && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-72 overflow-auto">
              {regions
                .filter((r) =>
                  r.toLowerCase().includes(regionSearch.toLowerCase())
                )
                .map((region) => (
                  <label
                    key={region}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={() =>
                        toggleSelection(region, selectedRegions, setSelectedRegions)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-gray-800 text-sm">{region}</span>
                  </label>
                ))}
            </div>
          )}
        </div>

        {/* Country Search */}
        <div className="relative flex-1">
          <div
            onClick={() => {
              setShowCountries(!showCountries);
              setShowRegions(false);
            }}
            className="flex items-center border border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer"
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setShowCountries(true);
              }}
              placeholder="Search Country"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {showCountries && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-72 overflow-auto">
              {countries
                .filter((c) =>
                  c.name.toLowerCase().includes(countrySearch.toLowerCase())
                )
                .map((c) => (
                  <label
                    key={c.code}
                    className="flex flex-col gap-1 py-2 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleSelection(c.name, selectedCountries, setSelectedCountries)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(c.name)}
                        onChange={() =>
                          toggleSelection(c.name, selectedCountries, setSelectedCountries)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-gray-800 text-sm">
                        {c.code} : {c.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 ml-6">
                      Authority (HA) Database(s)
                    </span>
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCategorySelector() {
  const [showBusinessUnits, setShowBusinessUnits] = useState(false);
  const [showCategoryLevels, setShowCategoryLevels] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
  const [selectedCategoryLevel, setSelectedCategoryLevel] = useState("");

  const businessUnits = [
    "Aesthetics & Reconstruction",
    "Circulatory Restoration",
    "Electrophysiology",
    "Heart Recovery",
    "Neurovascular",
    "Orthopedics",
    "Surgery",
    "Surgical Vision",
    "Vision Care",
    "Other: Not Listed",
  ];

  const categoryLevels = [
    "Implantable",
    "Non-implantable – single use",
    "Non-implantable – multi use",
  ];

  const handleSelect = (item, type) => {
    if (type === "business") {
      setSelectedBusinessUnit(item);
      setShowBusinessUnits(false);
    } else {
      setSelectedCategoryLevel(item);
      setShowCategoryLevels(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      businessUnit: selectedBusinessUnit,
      categoryLevel: selectedCategoryLevel,
    });
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-4xl mx-auto relative">
      <h2 className="text-lg font-medium mb-6">Select product category</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-center relative"
      >
        {/* Select Business Unit */}
        <div className="relative flex-1">
          <div
            onClick={() => {
              setShowBusinessUnits(!showBusinessUnits);
              setShowCategoryLevels(false);
            }}
            className="flex justify-between items-center border border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer"
          >
            <span className="text-gray-700">
              {selectedBusinessUnit || "Select Business Unit"}
            </span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>

          {showBusinessUnits && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-h-80 overflow-auto">
              {businessUnits.map((item) => (
                <label
                  key={item}
                  onClick={() => handleSelect(item, "business")}
                  className={`flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                    selectedBusinessUnit === item ? "bg-gray-100" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="business"
                    checked={selectedBusinessUnit === item}
                    onChange={() => handleSelect(item, "business")}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-gray-800 text-sm">{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Select Product Category Level */}
        <div className="relative flex-1">
          <div
            onClick={() => {
              setShowCategoryLevels(!showCategoryLevels);
              setShowBusinessUnits(false);
            }}
            className="flex justify-between items-center border border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer"
          >
            <span className="text-gray-700">
              {selectedCategoryLevel || "Select Product Category Level"}
            </span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>

          {showCategoryLevels && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3">
              {categoryLevels.map((item) => (
                <label
                  key={item}
                  onClick={() => handleSelect(item, "category")}
                  className={`flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                    selectedCategoryLevel === item ? "bg-gray-100" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategoryLevel === item}
                    onChange={() => handleSelect(item, "category")}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-gray-800 text-sm">{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-[#EB1700] text-white px-8 py-2 rounded-md font-medium hover:bg-[#d01400] transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}
function UdiAssessmentForm() {
  const [formData, setFormData] = useState({
    changeNumber: "",
    udiFiaNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-medium mb-4">
        What UDI assessment are you working on?
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          name="changeNumber"
          placeholder="Please enter ‘Change Number’"
          value={formData.changeNumber}
          onChange={handleChange}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <input
          type="text"
          name="udiFiaNumber"
          placeholder="Please enter ‘UDI FIA Number’"
          value={formData.udiFiaNumber}
          onChange={handleChange}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <button
          type="submit"
          className="bg-[#EB1700] text-white px-8 py-2 rounded-md font-medium hover:bg-[#d01400] transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}

function ProductTypeSelector() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (type) => {
    setSelected(type);
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-medium mb-6">
        What type of product are you assessing?
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* MedTech */}
        <div
          onClick={() => handleSelect("medtech")}
          className={`flex flex-col items-center justify-center flex-1 border rounded-[12px] py-8 cursor-pointer transition 
            ${
              selected === "medtech"
                ? "bg-gray-100 border-gray-300"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
        >
          <HeartPulse
            size={40}
            className={`${
              selected === "medtech" ? "text-purple-600" : "text-purple-500"
            } mb-2`}
          />
          <span className="font-medium text-gray-800">MedTech</span>
        </div>

        {/* Innovative Medicine */}
        <div
          onClick={() => handleSelect("medicine")}
          className={`flex flex-col items-center justify-center flex-1 border rounded-[12px] py-8 cursor-pointer transition 
            ${
              selected === "medicine"
                ? "bg-gray-100 border-gray-300"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
        >
          <Pill
            size={40}
            className={`${
              selected === "medicine" ? "text-red-600" : "text-red-500"
            } mb-2`}
          />
          <span className="font-medium text-gray-800">Innovative Medicine</span>
        </div>
      </div>

      {/* Conditional note */}
      {selected === "medicine" && (
        <div className="mt-4 border border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C] px-4 py-2 rounded-md text-sm italic">
          Note - There is no active use for UDI Assessments for Innovative
          Medicine at this time.
        </div>
      )}
    </div>
  );
}

const categories = [
  { id: 1, title: "Legal entity/legal manufacturer", icon: "🏢" },
  { id: 2, title: "EMDN or GMDN", icon: "🧬" },
  { id: 3, title: "Expanded Clinical Investigation", icon: "🧪" },
  { id: 4, title: "Sterilization (method or reusability)", icon: "🧴" },
  { id: 5, title: "Product Discontinuation and/or Obsolescence", icon: "🗑️" },
  { id: 6, title: "Direct Part Marking (change or addition)", icon: "🏷️" },
  { id: 7, title: "Packaging Details", icon: "📦" },
  { id: 8, title: "Commercial Strategy", icon: "🌍" },
  { id: 9, title: "Product Materials", icon: "⚠️" },
  { id: 10, title: "Storage and handling conditions", icon: "❄️" },
  {
    id: 11,
    title: "Labeling",
    icon: "🏷️",
    tooltip:
      "Resulting in creation of a NEW SURGICAL KIT using existing medical devices (Internally or externally) (for Saudi Arabia only)",
  },
  { id: 12, title: "Other (Custom)", icon: "➕" },
];

function ChangeCategoriesSelector() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] border border-gray-200 shadow-sm max-w-5xl mx-auto">
      <h2 className="text-lg font-medium mb-6">
        What change categories are involved in this change?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelected(cat.id)}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            className={`relative flex flex-col items-center justify-center text-center p-4 border rounded-xl cursor-pointer transition-all duration-200 bg-white shadow-sm ${
              selected === cat.id
                ? "border-[#EB1700] shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {cat.title}
            </p>
            {cat.tooltip && (
              <div className="absolute top-2 right-2">
                <Info size={14} className="text-gray-400" />
              </div>
            )}

            {/* Tooltip */}
            {hovered === cat.id && cat.tooltip && (
              <div className="absolute z-10 bottom-full mb-2 w-64 text-xs bg-gray-800 text-white p-2 rounded-md shadow-lg">
                {cat.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-[#EB1700] hover:bg-[#d01400] text-white font-medium px-10 py-2.5 rounded-[12px] shadow-md transition-all">
          Save
        </button>
      </div>
    </div>
  );
}

function EditorCanvas({ items: initialItems }) {
  const items = initialItems || [
    { id: 1, component: <UdiAssessmentForm/> },
    { id: 2, component: <ProductTypeSelector/> },
    { id: 3, component: <ProductCategorySelector/> },
    { id: 4, component: <RegionCountrySelector/>},
    { id: 5, component: <ChangeCategoriesSelector/>},
    
  ]

  const [active, setActive] = useState(0)

  // optional keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, items.length - 1))
      if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [items.length])

  const goNext = () => setActive((a) => Math.min(a + 1, items.length - 1))
  const goPrev = () => setActive((a) => Math.max(a - 1, 0))

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
                    className="absolute left-1/2 -translate-x-1/2 w-full "
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

