import { useState, useRef, useEffect } from "react";

const Icons = {
  Grid: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  ),
  Laptop: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.2 2.8c.1.2 0 .4-.2.4H3a.5.5 0 0 1-.2-.4L4 16"/>
    </svg>
  ),
  Book: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
    </svg>
  ),
  Pen: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  ),
  Trophy: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.45.98.96 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  Sparkles: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  Chevron: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  PenLine: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  )
};

const PRESETS = [
  { value: "Electronics", Icon: Icons.Laptop, desc: "Gadgets, cameras, computers" },
  { value: "Books",       Icon: Icons.Book,   desc: "Textbooks, novels, guides" },
  { value: "Stationery",  Icon: Icons.Pen,    desc: "Pens, notebooks, supplies" },
  { value: "Sports",      Icon: Icons.Trophy, desc: "Equipment & fitness gear" },
  { value: "Other",       Icon: Icons.Sparkles, desc: "Custom category name" },
];

const PRESET_VALUES = PRESETS.map((p) => p.value);

export default function CategorySelect({ value, onChange, inputClass = "" }) {
  const ref = useRef(null);
  const customInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  
  // Track if user explicitly selected "Other" to keep input visible even if empty
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Sync internal state if value is already custom from parent
  useEffect(() => {
    if (value && !PRESET_VALUES.includes(value)) {
      setIsOtherSelected(true);
    }
  }, [value]);

  const isCustom = value !== "" && !PRESET_VALUES.includes(value);
  const activePreset = PRESET_VALUES.includes(value) ? value : "Other";
  
  const selectedObj = PRESETS.find((p) => p.value === (isOtherSelected ? "Other" : value));
  const DisplayIcon = selectedObj ? selectedObj.Icon : Icons.Grid;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus custom input when it appears
  useEffect(() => {
    if (isOtherSelected && customInputRef.current) customInputRef.current.focus();
  }, [isOtherSelected]);

  const handleSelect = (preset) => {
    setOpen(false);
    if (preset.value === "Other") {
      setIsOtherSelected(true);
      onChange(""); // Clear for custom input
    } else {
      setIsOtherSelected(false);
      onChange(preset.value);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 text-left transition-all cursor-pointer ${
          inputClass ||
          "py-3.5 px-5 bg-white border border-slate-200 rounded-2xl text-slate-700 shadow-sm hover:border-blue-400 focus:ring-4 focus:ring-blue-50/50"
        } ${open ? "border-blue-500 ring-4 ring-blue-50/50" : ""}`}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
           <DisplayIcon className="w-4 h-4" />
        </div>
        <span className="flex-1 font-black text-xs uppercase tracking-widest truncate">
          {value || "Select Category"}
        </span>
        <Icons.Chevron className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${open ? "rotate-180 text-blue-500" : ""}`} />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl animate-fadeIn overflow-hidden p-2">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleSelect(preset)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"}`}>
                   <preset.Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-white" : "text-slate-900"}`}>
                    {preset.value}
                  </p>
                  <p className={`text-[9px] font-bold mt-0.5 ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                    {preset.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Custom category text input ── */}
      {isOtherSelected && (
        <div className="mt-3 relative animate-fadeIn">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
             <Icons.PenLine className="w-4 h-4" />
          </div>
          <input
            ref={customInputRef}
            type="text"
            placeholder="Type your own category..."
            value={isCustom ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-11 pr-5 py-4 bg-white border-2 border-blue-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all shadow-inner"
          />
        </div>
      )}
    </div>
  );
}
