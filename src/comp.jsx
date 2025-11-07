function RegionCountrySelector() {
  const wrapperRef = useRef(null);
  const [showRegions, setShowRegions] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null); // single
  const [selectedCountry, setSelectedCountry] = useState(null); // single
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowId = searchParams.get("workflow_id");
  const regions = [
    "Asia Pacific (APAC)",
    "Europe (EU)",
    "Latin America (LATAM)",
    "Middle East & Africa (MEA)",
    "North America (NA)",
  ];
  const goto = (next) => {
  const params = new URLSearchParams(searchParams);
  params.set("step", String(next));
  setSearchParams(params);
};

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


  const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
  const params = new URLSearchParams(searchParams);
  const current = parseInt(params.get("step") || "1", 10) || 1;
  const next = current + 1;
  params.set("step", String(next));
  setSearchParams(params);
};
  const patchRegion = async (region) => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }
    try {
      const payload = { region };
      const response = await patchWorkflow(payload, workflowId);
      if(response.data?.action_item){
        const params = new URLSearchParams(searchParams);
        params.set("step","10")
        params.set("action", String(response.data.action_item));
        setSearchParams(params);
      }
      if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }
      console.log("Patched region:", response);
      // optional: show toast/notification based on res
    } catch (err) {
      console.error("Error patching region:", err);
      toast.error("Failed to update region.");
    }
  };

  const patchCountry = async (countryObj) => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }
    try {
      // Send both name and code to be safe — adjust to your backend schema if needed
      const payload = {
        country: countryObj,
      };
      const response = await patchWorkflow(payload, workflowId);
      
      if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }
        if(response.data?.action_item){
          const params = new URLSearchParams(searchParams);
          params.set("step","10")
        params.set("action", String(response.data.action_item));
        setSearchParams(params);
      }else{
          if(response.data?.least_distinct_field_in_modelb?.field){}else{goNext()}
          
        }
    } catch (err) {
      console.error("Error patching country:", err);
      toast.error("Failed to update country.");
    }
  };

  const onSelectRegion = (region) => {
    if (region === selectedRegion) {
      // unselect — clear region + country
      setSelectedRegion(null);
      setSelectedCountry(null);
      setShowRegions(false);
      setShowCountries(false);
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
  
    setSelectedCountry(countryObj);
    
    setShowCountries(false);

    patchCountry(countryObj);
    // if unselecting and you want to remove country from backend, you could call:
    // else patchCountry({ name: null, code: null });
  };




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
  const [searchParams, setSearchParams] = useSearchParams();
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

  const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workflowId) {
      toast.error("Please create a workflow first before saving this step.");
      return;
    }

    try {
      const payload = {
        product_category_unit: selectedBusinessUnit,
        product_category_level: selectedCategoryLevel,
      };

      const response = await patchWorkflow(payload, workflowId);

      if (response && (response.success || response.id)) {
        
      if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }
        
        if(response.data?.action_item){
          const params = new URLSearchParams(searchParams);
          
        params.set("action", String(response.data.action_item));
        params.set("step", String(10));
        setSearchParams(params);
      }else{
          if(response.data?.least_distinct_field_in_modelb?.field){}else{goNext()}
          
        }
      } else {
        toast.error("Failed to update workflow");
      }
    } catch (err) {
      console.error("Error updating workflow:", err);
      toast.error("Something went wrong while updating workflow.");
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
                  className={`flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer hover:bg-gray-50 ${selectedBusinessUnit === item ? "bg-gray-100" : ""
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
                  className={`flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer hover:bg-gray-50 ${selectedCategoryLevel === item ? "bg-gray-100" : ""
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
const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // goto(getIndexFromKey("e"));

    try {
      let response;

      if (workflowId) {
        // PATCH (update) expects backend keys exactly as serializer/model
        response = await patchWorkflow(formData, workflowId);
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
      goNext();

      } else {
        toast.error(`Failed to ${workflowId ? "update" : "create"} workflow`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Something went wrong!");
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
  const [searchParams,setSearchParams] = useSearchParams();
  const workflowId = searchParams.get("workflow_id");

  const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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
  const handleSelect = async (type) => {
    setSelected(type);

    // ✅ If workflow_id exists, patch immediately
    if (!workflowId) {
      toast.error("Please create a UDI workflow first.");
      return;
    }

    try {
      const payload = { product_type: type };
      const response = await patchWorkflow(payload, workflowId);

      if (response && (response.success || response.id)) {
        console.log("Product type updated:", response);
        
        if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }else if(response.data?.action_item){
          const params = new URLSearchParams(searchParams);
          params.set("step","10")
        params.set("action", String(response.data.action_item));
        setSearchParams(params);
        }else{
          goNext()
          
        }
      } else {
        toast.error("Failed to update product type");
      }
    } catch (err) {
      console.error("Error updating product type:", err);
      toast.error("Something went wrong while updating product type.");
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
            ${selected === "medtech"
              ? "bg-gray-100 border-gray-300"
              : "bg-white border-gray-200 hover:border-gray-300"
            }`}
        >
          <HeartPulse
            size={40}
            className={`${selected === "medtech" ? "text-purple-600" : "text-purple-500"
              } mb-2`}
          />
          <span className="font-medium text-gray-800">MedTech</span>
        </div>

        {/* Innovative Medicine */}
        <div
          onClick={() => handleSelect("medicine")}
          className={`flex flex-col items-center justify-center flex-1 border rounded-[12px] py-8 cursor-pointer transition 
            ${selected === "medicine"
              ? "bg-gray-100 border-gray-300"
              : "bg-white border-gray-200 hover:border-gray-300"
            }`}
        >
          <Pill
            size={40}
            className={`${selected === "medicine" ? "text-red-600" : "text-red-500"
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

  const goNext = () => {
    // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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
              className={`relative flex flex-col items-center justify-center text-center p-4 border rounded-xl cursor-pointer transition-all duration-200 bg-white shadow-sm ${isSelected
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
            console.log("Selected categories:", selected);
            goNext();
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
  const workflowId = searchParams.get('workflow_id');

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

  const saveChangeinvolved = async (categoryId, detail) => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }
    try {
      const categoryTitle = categories.find((c) => c.id === categoryId)?.title;
      const payload = {
        workflow: workflowId,
        change_category: categoryTitle,
        change_description: detail
      };
      const response = await createChangeinvolved(payload);
      console.log("Created changes-involved record:", response);

      if (response.success) {
        toast.success(`Successfully saved detail for ${categoryTitle}`);
      } else {
        toast.error("Failed to create changes-involved record.");
      }
    } catch (err) {
      console.error("Error creating changes-involved record:", err);
      toast.error("Failed to create changes-involved record.");
    }
  };

  const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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

  const handleSave = async (id) => {
    const detail = details[id] || "";
    await saveChangeinvolved(id, detail);
  };

  const handleDelete = (id) => {
    const ids = selectedCategories.map((c) => c.id).filter((x) => x !== id);
    if (ids.length > 0) searchParams.set("categories", ids.join(","));
    else searchParams.delete("categories");
    setSearchParams(searchParams);
  };

  const handleSubmit = async () => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }

    try {
      const payload = {
        all_category_details: details,
        category_details_completed: true
      };
      const response = await patchWorkflow(payload, workflowId);
      console.log("Submitted all category details:", response);
      toast.success("All category details submitted successfully!");
      goNext(); 
    } catch (err) {
      console.error("Error submitting category details:", err);
      toast.error("Failed to submit category details.");
    }
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
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowId = searchParams.get('workflow_id');


   const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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
  const patchGTINChange = async (value) => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }
    try {
      const payload = { gtin_evaluation: value };
      const response = await patchWorkflow(payload, workflowId);
      console.log("Patched GTIN change evaluation:", response);
      
      if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }
        if(response.data?.action_item){
          const params = new URLSearchParams(searchParams);
          params.set("step","10")
        params.set("action", String(response.data.action_item));
        setSearchParams(params);
      }else{
          if(response.data?.least_distinct_field_in_modelb?.field){}else{goNext()}
          
        }
    } catch (err) {
      console.error("Error patching GTIN change evaluation:", err);
      toast.error("Failed to update GTIN change evaluation.");
    }
  };

  function handleSelect(value) {
    setSelected(value);
    patchGTINChange(value);
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
  const workflowId = searchParams.get('workflow_id');

  const options = ["Yes", "No", "Pending Review"]
  
 const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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
  const patchUdiRecordImpact = async (value) => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }
    try {
      const payload = { has_udi_health_impact: value };
      const response = await patchWorkflow(payload, workflowId);
      console.log("Patched UDI record impact:", response);
      
      if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }
        if(response.data?.action_item){
          const params = new URLSearchParams(searchParams);
          params.set("step","10")
        params.set("action", String(response.data.action_item));
        setSearchParams(params);
      }else{
          if(response.data?.least_distinct_field_in_modelb?.field){}else{goNext()}
          
        }
    } catch (err) {
      console.error("Error patching UDI record impact:", err);
      toast.error("Failed to update UDI record impact.");
    }
  };

  const handleSelect = (value) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("udi_record_impact", value)
    setSearchParams(newParams)
    patchUdiRecordImpact(value);
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
              ${selected === opt
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
function WorkflowModal({ isOpen, onClose, workflow }) {
  if (!isOpen || !workflow) return null;

  return (
<div className="fixed inset-0 bg-[#F9FAFB]/70 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white rounded-[16px] shadow-lg p-6 w-[90%] max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">MRI Label Update</h2>

        <div className="space-y-4">
          {[1, 2].map((_, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-4 border border-gray-100 p-4 rounded-xl">
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Change Number</p>
                <p className="font-semibold">{workflow.change_number}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">GTIN Change Outcome</p>
                <p className="font-semibold">{workflow.gtin_change || "N/A"}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">UDI HA Database Impact</p>
                <p className="font-semibold">{workflow.udi_database}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Action</p>
                <p className="font-semibold">Regulatory notified</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-semibold">{workflow.status}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
          
            onClick={()=> patchWorkflow({status: 'Rejected'} , workflow.id).then(d => console.log(d)  )} 
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Reject
          </button>
          <button
           onClick={()=> patchWorkflow({status: 'Approved'} , workflow.id).then(d => console.log(d)  )}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
function GtinImpactQuestion() {
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowId = searchParams.get('workflow_id');


  const goNext = () => {
  // preserve all existing params and increment "step" (default to 1 if missing/invalid)
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
  const patchGtinImpact = async (value) => {
    if (!workflowId) {
      toast.error("Please create a workflow first.");
      return;
    }
    try {
      const payload = { gtin_change: value };
      const response = await patchWorkflow(payload, workflowId);
      
      if(response.data?.least_distinct_field_in_modelb?.field){

          goto(getIndexFromKey(response.data?.least_distinct_field_in_modelb?.field));
        }
        if(response.data?.action_item){
          const params = new URLSearchParams(searchParams);
          params.set("step","10")
        params.set("action", String(response.data.action_item));
        setSearchParams(params);
      }else{
          if(response.data?.least_distinct_field_in_modelb?.field){}else{goNext()}
          
        }
    } catch (err) {
      console.error("Error patching GTIN impact question:", err);
      toast.error("Failed to update GTIN impact question.");
    }
  };

  const handleSelect = (value) => {
    setSelected(value);
    patchGtinImpact(value);
  };

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
              onClick={() => handleSelect(opt.value)}
              className={`w-full py-3 rounded-xl border text-base font-medium transition-all duration-200 ${selected === opt.value
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