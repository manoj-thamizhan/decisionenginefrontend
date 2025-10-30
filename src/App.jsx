import React, { useMemo, useState,useRef ,useEffect} from 'react'
import { Routes, Route, Link, useNavigate,useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter,Send, ArrowUpDown, ArrowRight, Info,ArrowLeft, LogOutIcon,HeartPulse, Pill , ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import OneIcon from "./assets/1.svg";
import TwoIcon from "./assets/2.svg";
import ThreeIcon from "./assets/3.svg";
import FourIcon from "./assets/4.svg";
import { createWorkflow, patchWorkflow } from './apiservice';
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
       
<StatCard title="Total Workflows" number={data.length}>
  <img src={OneIcon} alt="Total Workflows" className="w-6 h-6" />
</StatCard>

<StatCard title="Pending Review" number={data.filter(d => d.status !== 'Done').length}>
  <img src={TwoIcon} alt="Pending Review" className="w-6 h-6" />
</StatCard>

<StatCard title="Rejected" number={data.filter(d => d.status === 'Done').length}>
  <img src={ThreeIcon} alt="Rejected" className="w-6 h-6" />
</StatCard>

<StatCard title="Completed" number={3}>
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
  const wrapperRef = useRef(null);
  const [showRegions, setShowRegions] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null); // single
  const [selectedCountry, setSelectedCountry] = useState(null); // single
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get("workflow_id");
  const regions = [
    "Asia Pacific (APAC)",
    "Europe (EU)",
    "Latin America (LATAM)",
    "Middle East & Africa (MEA)",
    "North America (NA)",
  ];

  const regionCountryMap = {
    "Asia Pacific (APAC)": [
      { code: "IN", name: "India" },
      { code: "JP", name: "Japan" },
      { code: "AU", name: "Australia" },
    ],
    "Europe (EU)": [
      { code: "FR", name: "France" },
      { code: "MC", name: "Monaco" },
      { code: "DE", name: "Germany" },
    ],
    "Latin America (LATAM)": [
      { code: "BR", name: "Brazil" },
      { code: "AR", name: "Argentina" },
    ],
    "Middle East & Africa (MEA)": [
      { code: "SA", name: "Saudi Arabia" },
      { code: "ZA", name: "South Africa" },
    ],
    "North America (NA)": [
      { code: "US", name: "United States" },
      { code: "CA", name: "Canada" },
    ],
  };

  const countries = selectedRegion ? regionCountryMap[selectedRegion] || [] : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowRegions(false);
        setShowCountries(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const patchRegion = async (region) => {
    if (!workflowId) {
      alert("Please create a workflow first.");
      return;
    }
    try {
      const payload = { region };
      const res = await patchWorkflow(payload, workflowId);
      console.log("Patched region:", res);
      // optional: show toast/notification based on res
    } catch (err) {
      console.error("Error patching region:", err);
      alert("Failed to update region.");
    }
  };

  const patchCountry = async (countryObj) => {
    if (!workflowId) {
      alert("Please create a workflow first.");
      return;
    }
    try {
      // Send both name and code to be safe — adjust to your backend schema if needed
      const payload = {
        country: countryObj.name,
        country_code: countryObj.code,
      };
      const res = await patchWorkflow(payload, workflowId);
      console.log("Patched country:", res);
    } catch (err) {
      console.error("Error patching country:", err);
      alert("Failed to update country.");
    }
  };

  const onSelectRegion = (region) => {
    if (region === selectedRegion) {
      // unselect — clear region + country
      setSelectedRegion(null);
      setSelectedCountry(null);
      setShowRegions(false);
      setShowCountries(false);
      // Optionally clear on backend: send region = null (uncomment if desired)
      // patchRegion(null);
    } else {
      setSelectedRegion(region);
      setSelectedCountry(null);
      setShowRegions(false);
      setShowCountries(true);
      setCountrySearch("");

      // optimistic backend update
      patchRegion(region);
    }
  };

  const onSelectCountry = (countryObj) => {
    const isSame =
      selectedCountry && selectedCountry.code === countryObj.code;
    if (isSame) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(countryObj);
    }
    setShowCountries(false);

    // optimistic backend update
    if (!isSame) patchCountry(countryObj);
    // if unselecting and you want to remove country from backend, you could call:
    // else patchCountry({ name: null, code: null });
  };


  // const onSelectRegion = (region) => {
  //   if (region === selectedRegion) {
  //     // unselecting allowed? per requirement, we keep exactly one region OR allow none.
  //     // We'll keep behavior: clicking same region unselects it and clears country.
  //     setSelectedRegion(null);
  //     setSelectedCountry(null);
  //     setShowRegions(false);
  //     setShowCountries(false);
  //   } else {
  //     setSelectedRegion(region);
  //     setSelectedCountry(null); // clear previous country
  //     setShowRegions(false);
  //     setShowCountries(true); // open country dropdown for chosen region
  //     setCountrySearch("");
  //   }
  // };

  // const onSelectCountry = (countryName) => {
  //   if (countryName === selectedCountry) {
  //     setSelectedCountry(null);
  //   } else {
  //     setSelectedCountry(countryName);
  //   }
  //   setShowCountries(false);
  // };

  return (
    <div ref={wrapperRef} className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-5xl mx-auto relative">
      <h2 className="text-lg font-medium mb-6">
        Select Region/Country where products are distributed or intended to be distributed
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-start relative">
        {/* Region */}
        <div className="relative flex-1 min-w-[200px]">
          <div
            onClick={() => {
              setShowRegions((s) => !s);
              setShowCountries(false);
            }}
            className="flex items-center border border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer"
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={selectedRegion ?? regionSearch}
              onChange={(e) => {
                setRegionSearch(e.target.value);
                setShowRegions(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowRegions(true);
              }}
              placeholder="Select Region"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              readOnly={false}
            />
          </div>

          {showRegions && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-72 overflow-auto">
              {regions
                .filter((r) => r.toLowerCase().includes(regionSearch.toLowerCase()))
                .map((region) => (
                  <label
                    key={region}
                    className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="region"
                      checked={selectedRegion === region}
                      onChange={() => onSelectRegion(region)}
                      className="w-4 h-4 text-blue-600 border-gray-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 text-sm">{region}</span>
                      <span className="text-xs text-gray-500">
                        {regionCountryMap[region]?.length || 0} countries
                      </span>
                    </div>
                  </label>
                ))}
              {regions.filter((r) => r.toLowerCase().includes(regionSearch.toLowerCase())).length === 0 && (
                <div className="text-sm text-gray-500 py-2 px-2">No regions found</div>
              )}
            </div>
          )}
        </div>

        {/* Country */}
        <div className="relative flex-1 min-w-[200px]">
          <div
            onClick={() => {
              // if no region, prompt region list
              if (!selectedRegion) {
                setShowRegions(true);
                setShowCountries(false);
                return;
              }
              setShowCountries((s) => !s);
              setShowRegions(false);
            }}
            className={`flex items-center border border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer ${!selectedRegion ? "opacity-60" : ""}`}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={selectedCountry ?? countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setShowCountries(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!selectedRegion) {
                  setShowRegions(true);
                  setShowCountries(false);
                } else {
                  setShowCountries(true);
                }
              }}
              placeholder={selectedRegion ? "Select Country" : "Select a region first"}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              disabled={!selectedRegion}
              readOnly={false}
            />
          </div>

          {showCountries && selectedRegion && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-72 overflow-auto">
              {countries
                .filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                .map((c) => (
                  <label
                    key={c.code}
                    className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="country"
                      checked={selectedCountry === c.name}
                      onChange={() => onSelectCountry(c.name)}
                      className="w-4 h-4 text-blue-600 border-gray-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 text-sm">{c.code} : {c.name}</span>
                      <span className="text-xs text-gray-500">Authority (HA) Database(s)</span>
                    </div>
                  </label>
                ))}

              {countries.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
                <div className="text-sm text-gray-500 py-2 px-2">No countries found for {selectedRegion}</div>
              )}
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
}
function ProductCategorySelector() {
  const [searchParams] = useSearchParams();
const workflowId = searchParams.get("workflow_id");
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!workflowId) {
    alert("Please create a workflow first before saving this step.");
    return;
  }

  try {
    const payload = {
      business_unit: selectedBusinessUnit,
      product_category_level: selectedCategoryLevel,
    };

    const response = await patchWorkflow(payload, workflowId);

    if (response && (response.success || response.id)) {
      alert("Workflow updated successfully!");
      console.log("Workflow patched:", response);
    } else {
      alert("Failed to update workflow");
    }
  } catch (err) {
    console.error("Error updating workflow:", err);
    alert("Something went wrong while updating workflow.");
  }
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
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowId = searchParams.get('workflow_id')
  const [formData, setFormData] = useState({
    change_number: "",
    udr_fia_number: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (workflowId) {
        // PATCH (update) expects backend keys exactly as serializer/model
        response = await patchWorkflow (formData, workflowId);
        console.log("Workflow updated:", response);
      } else {
        // Create new workflow
        response = await createWorkflow(formData);
        if (response?.data?.id) {
          searchParams.set("workflow_id", response?.data?.id);
          setSearchParams(searchParams);
        }
        console.log("Workflow created:", response);
      }

      if (response && response.success) {
        alert(`Workflow ${workflowId ? "updated" : "created"} successfully!`);
      } else {
        alert(`Failed to ${workflowId ? "update" : "create"} workflow`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] shadow-sm border border-gray-100 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-medium mb-4">
        What UDI assessment are you working on?
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-center"
      >
        <input
          type="text"
          name="change_number"
          placeholder="Please enter ‘Change Number’"
          value={formData.change_number}
          onChange={handleChange}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <input
          type="text"
          name="udr_fia_number"
          placeholder="Please enter ‘UDR FIA Number’"
          value={formData.udr_fia_number}
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
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get("workflow_id");
 const handleSelect = async (type) => {
    setSelected(type);

    // ✅ If workflow_id exists, patch immediately
    if (!workflowId) {
      alert("Please create a UDI workflow first.");
      return;
    }

    try {
      const payload = { product_type: type };
      const response = await patchWorkflow(payload, workflowId);

      if (response && (response.success || response.id)) {
        console.log("Product type updated:", response);
      } else {
        alert("Failed to update product type");
      }
    } catch (err) {
      console.error("Error updating product type:", err);
      alert("Something went wrong while updating product type.");
    }
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
  // selected is an array of selected category ids (numbers)
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState(null);

  // react-router hook to read & set search params
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize selected from URL on mount
  useEffect(() => {
    const cats = searchParams.get("categories");
    if (cats) {
      const ids = cats
        .split(",")
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));
      setSelected(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Sync selected -> URL whenever selected changes
  useEffect(() => {
    // create plain object from existing params to preserve other params
    const paramsObj = Object.fromEntries([...searchParams.entries()]);

    if (selected.length > 0) {
      paramsObj.categories = selected.join(",");
    } else {
      // remove the param if nothing selected
      delete paramsObj.categories;
    }

    setSearchParams(paramsObj, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // toggle selection of a category id
  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      return [...prev, id].sort((a, b) => a - b);
    });
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] border border-gray-200 shadow-sm max-w-5xl mx-auto">
      <h2 className="text-lg font-medium mb-6">
        What change categories are involved in this change?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id);
          return (
            <div
              key={cat.id}
              role="button"
              tabIndex={0}
              onClick={() => toggle(cat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(cat.id);
                }
              }}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative flex flex-col items-center justify-center text-center p-4 border rounded-xl cursor-pointer transition-all duration-200 bg-white shadow-sm ${
                isSelected
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

              {/* visual check-mark for multi-select */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#EB1700]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            // example action: you can access `selected` directly here or rely on URL param
            console.log("Selected categories:", selected);
          }}
          className="bg-[#EB1700] hover:bg-[#d01400] text-white font-medium px-10 py-2.5 rounded-[12px] shadow-md transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
}
function SelectedCategoriesForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const param = searchParams.get("categories");
    if (param) {
      const ids = param
        .split(",")
        .map((x) => Number(x))
        .filter((x) => !Number.isNaN(x));
      const selected = categories.filter((c) => ids.includes(c.id));
      setSelectedCategories(selected);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const [details, setDetails] = useState({});

  const handleSave = (id) => {
    alert(`Saved for ${categories.find((c) => c.id === id)?.title}: ${details[id] || ""}`);
  };

  const handleDelete = (id) => {
    const ids = selectedCategories.map((c) => c.id).filter((x) => x !== id);
    if (ids.length > 0) searchParams.set("categories", ids.join(","));
    else searchParams.delete("categories");
    setSearchParams(searchParams);
  };

  const handleSubmit = () => {
    alert("Submitting all category details: " + JSON.stringify(details, null, 2));
  };

  return (
    <div className="bg-[#FAFAFA] p-6 rounded-[12px] border border-gray-200 shadow-sm max-w-5xl mx-auto">
      <h2 className="text-lg font-medium mb-6">
        What change categories are involved in this change?
      </h2>

      {selectedCategories.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No categories selected. Please select categories first.
        </p>
      ) : (
        <div className="space-y-6">
          {selectedCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm"
            >
              {/* Icon and title */}
              <div className="flex flex-col items-center sm:w-64 text-center sm:text-left">
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h3 className="font-medium text-gray-800">{cat.title}</h3>
              </div>

              {/* Input and buttons */}
              <div className="flex-1 space-y-3">
                <label className="block text-sm text-gray-500 mb-1">
                  Provide more detail from the change request
                </label>
                <input
                  type="text"
                  placeholder="Enter Here"
                  value={details[cat.id] || ""}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#EB1700] focus:border-[#EB1700] outline-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="border border-[#EB1700] text-[#EB1700] rounded-[8px] px-4 py-1.5 text-sm font-medium hover:bg-[#FFF1F0] transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSave(cat.id)}
                    className="border border-[#EB1700] text-[#EB1700] rounded-[8px] px-4 py-1.5 text-sm font-medium hover:bg-[#FFF1F0] transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#EB1700] hover:bg-[#d01400] text-white font-medium px-10 py-2.5 rounded-[12px] shadow-md transition-all"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
function GTINChangeEvaluation({ initial = 'yes', onChange }) {
const [selected, setSelected] = useState(initial);


function handleSelect(value) {
setSelected(value);
if (typeof onChange === 'function') onChange(value);
}


const optionBase = 'flex-1 rounded-lg border px-6 py-3 cursor-pointer transition-shadow duration-150';
const selectedClasses = 'border-green-400 shadow-sm ring-2 ring-green-200 bg-white';
const unselectedClasses = 'border-gray-200 bg-white hover:shadow-sm';


return (
<div className="max-w-3xl mx-auto p-6">
<div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
<h3 className="text-sm font-medium text-gray-700 mb-4">GTIN Change Evaluation</h3>


<div className="flex gap-4">
<button
type="button"
aria-pressed={selected === 'yes'}
onClick={() => handleSelect('yes')}
className={`${optionBase} ${selected === 'yes' ? selectedClasses : unselectedClasses} text-green-700 font-medium text-center`}
>
Yes
</button>


<button
type="button"
aria-pressed={selected === 'no'}
onClick={() => handleSelect('no')}
className={`${optionBase} ${selected === 'no' ? 'border-gray-400 shadow-sm' : unselectedClasses} text-gray-700 font-medium text-center`}
>
No
</button>


<button
type="button"
aria-pressed={selected === 'retention'}
onClick={() => handleSelect('retention')}
className={`${optionBase} ${selected === 'retention' ? 'border-gray-400 shadow-sm' : unselectedClasses} text-gray-700 font-medium text-center`}
>
GTIN Retention
</button>
</div>


<p className="mt-3 text-xs text-gray-500">
GTIN Retention - Option for approval to keep same GTIN, complete form{' '}
<span className="text-red-600 italic font-medium">501394274</span>
</p>
</div>
</div>
);
}

function UdiRecordImpactSelector() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selected = searchParams.get("udi_record_impact") || ""

  const options = ["Yes", "No", "Pending Review"]

  const handleSelect = (value) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("udi_record_impact", value)
    setSearchParams(newParams)
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-medium mb-3">UDI Health Authority Record Impact</h3>
      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all
              ${
                selected === opt
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function GtinImpactQuestion() {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      value: "Yes",
      description:
        "This change impact resulted in a new GTIN which is a new UDI HA record, therefore update to the existing UDI HA record does not apply.",
    },
    {
      value: "No",
      description:
        "This change requires updates to the required data sources and to the UDI HA Record(s). Refer to Form 502082335 for selection of data sources to be actioned for this change control.",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 w-full">
      <h2 className="text-lg font-semibold mb-6">
        Did this change impact result in a new GTIN?
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {options.map((opt) => (
          <div key={opt.value} className="flex-1 text-center">
            <button
              onClick={() => setSelected(opt.value)}
              className={`w-full py-3 rounded-xl border text-base font-medium transition-all duration-200 ${
                selected === opt.value
                  ? "border-green-600 text-green-700 bg-green-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {opt.value}
            </button>

            <p className="text-xs text-gray-600 mt-3 leading-snug">
              {opt.description}
            </p>
          </div>
        ))}
      </div>
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
    const [searchParams,setSearchParams] = useSearchParams()
  const udi_record_impact = searchParams.get("udi_record_impact")
  const baseItems = initialItems || [
    { id: 1, component: <UdiAssessmentForm/> },
    { id: 2, component: <ProductTypeSelector/> },
    { id: 3, component: <ProductCategorySelector/> },
    { id: 4, component: <RegionCountrySelector/>},
    { id: 5, component: <ChangeCategoriesSelector/>},
    { id: 6, component: <SelectedCategoriesForm/>},
    { id: 7, component: <GTINChangeEvaluation/>},
    { id: 8, component: <UdiRecordImpactSelector/>},
    { id: 9, component: <GtinImpactQuestion/>},
    { id: 10, component: <NotifyWorkflowSummary/>},
    { id: 11, component: <NotifyWorkflowSummaryLast/>},
    
    

    
    
    
    
  ]

    if (udi_record_impact === "Yes") {
    baseItems.splice(8, 0, { id: 999, component: <GtinImpactQuestion/> })
  }

  const items = baseItems;

const stepParam = parseInt(searchParams.get("step") || "1", 10)
const active = Math.min(Math.max(stepParam - 1, 0), (items?.length || 0) - 1)


  // optional keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowDown") goNext()
      if (e.key === "ArrowUp") goPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [items.length])

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
          <h3 className="font-semibold">Main Editor</h3>
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

