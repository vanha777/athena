"use client";

import { useState, useCallback } from "react";

const STAMP_DUTY = {
  VIC: { threshold: [0, 25000, 130000, 960000, 2000000], rate: [0, 0.014, 0.024, 0.06, 0.055], base: [0, 0, 1070, 26070, 111217] },
  NSW: { threshold: [0, 15000, 32000, 87000, 327000, 1087000, 3268000], rate: [0, 0.0125, 0.015, 0.0175, 0.035, 0.045, 0.055], base: [0, 0, 263, 893, 4509, 30835, 72455] },
  QLD: { threshold: [0, 5000, 75000, 540000, 1000000], rate: [0, 0.015, 0.025, 0.03, 0.035], base: [0, 0, 1050, 12675, 26475] },
  SA: { threshold: [0, 12000, 30000, 50000, 100000, 200000, 250000, 300000, 500000], rate: [0, 0.01, 0.02, 0.03, 0.035, 0.04, 0.045, 0.05, 0.055], base: [0, 0, 180, 540, 1590, 3340, 7340, 9590, 19590] },
  WA: { threshold: [0, 80000, 100000, 250000, 500000], rate: [0, 0.015, 0.019, 0.028, 0.038], base: [0, 0, 1200, 4060, 11060] },
  TAS: { threshold: [0, 3000, 25000, 75000, 200000, 375000, 725000], rate: [0, 0.01, 0.0175, 0.025, 0.03, 0.035, 0.04], base: [0, 0, 70, 945, 4070, 7820, 20570] },
  ACT: { threshold: [0, 200000, 300000, 500000, 750000, 1000000, 1455000], rate: [0, 0.006, 0.023, 0.049, 0.055, 0.057, 0.064], base: [0, 0, 1200, 3500, 15750, 29500, 44685] },
  NT: { threshold: [0, 525000], rate: [0, 0.04895], base: [0, 0] },
};

function calcSD(price: number, state: string) {
  const sd = (STAMP_DUTY as any)[state];
  if (!sd || isNaN(price)) return 0;
  let d = 0;
  for (let i = sd.threshold.length - 1; i >= 0; i--) {
    if (price > sd.threshold[i]) {
      d = sd.base[i] + (price - sd.threshold[i]) * sd.rate[i];
      break;
    }
  }
  return Math.round(d);
}

const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const DEV_NAV = ["Multi-Dwelling", "Subdivision", "Knockdown Rebuild", "Commercial"];
const NAV_TABS = ["inputs", "results", "ai"];

const D = {
  devType: "Multi-Dwelling",
  state: "VIC",
  purchasePrice: 900000,
  legalsDue: 3500,
  dueDiligence: 1500,
  buildCostPerSqm: 2400,
  gfa: 380,
  numDwellings: 2,
  contingency: 10,
  provisionalSums: 15000,
  planningPermits: 8000,
  designFees: 18000,
  surveying: 4500,
  councilContributions: 12000,
  utilityConnections: 8000,
  loanLvr: 65,
  interestRate: 7.2,
  loanTermMonths: 18,
  establishmentFee: 1.0,
  grvPerUnit: 850000,
  agentCommission: 2.0,
  marketing: 8000,
  gstOnSales: true,
  councilRates: 1800,
  insurance: 1200,
  pmFees: 0,
  holdMonths: 18,
  subdivisionLots: 2,
  lotGRV: 450000,
  commercialGRV: 1200000,
  commercialBuildCost: 2800,
  commercialGFA: 400,
};

const $ = (n: number) => isNaN(n) ? "$0" : "$" + Math.round(n).toLocaleString("en-AU");
const pct = (n: number) => isFinite(n) ? n.toFixed(1) + "%" : "—";

// Components defined outside to prevent focus loss on rerender
const NI = ({ val, onChange, step = 1, min = 0, pre, suf }: { val: number, onChange: (v: number) => void, step?: number, min?: number, pre?: string, suf?: string }) => (
  <div className="flex items-center gap-1 shrink-0">
    {pre && <span className="text-xs text-gray-400">{pre}</span>}
    <input
      type="number"
      value={isNaN(val) ? "" : val}
      min={min}
      step={step}
      onChange={e => onChange(e.target.value === "" ? NaN : parseFloat(e.target.value))}
      onFocus={e => e.target.select()}
      className="w-[140px] text-sm px-2.5 py-2 border border-[#e0ded8] rounded-md bg-[#fafaf9] text-[#1c1c1e] text-right outline-none focus:border-[#4a9eff] focus:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
    {suf && <span className="text-xs text-gray-400">{suf}</span>}
  </div>
);

const FR = ({ label, sub, children, auto }: { label: string, sub?: string, children?: React.ReactNode, auto?: string }) => (
  <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-[#f5f4f2] gap-2 last:border-b-0">
    <div className="flex-1 min-w-0">
      <div className="text-xs text-[#555] font-medium">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
    {auto ? <span className="text-xs text-gray-400 italic whitespace-nowrap">{auto}</span> : <div>{children}</div>}
  </div>
);

const Sec = ({ id, title, sum, children, isOpen, onToggle }: { id: string, title: string, sum?: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
  <div className="bg-white rounded-lg border border-[#e0ded8] mb-2 overflow-hidden">
    <div 
      className={`flex justify-between items-center px-3.5 py-2.5 cursor-pointer select-none hover:bg-gray-50 transition-colors ${isOpen ? "bg-gray-50/50 border-b border-[#f0efec]" : ""}`} 
      onClick={onToggle}
    >
      <span className="text-sm font-semibold text-[#1c1c1e]">{title}</span>
      <div className="flex items-center">
        {!isOpen && sum && <span className="text-xs text-gray-400 mr-2">{sum}</span>}
        <span className={`text-[10px] text-gray-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </div>
    </div>
    {isOpen && <div>{children}</div>}
  </div>
);

export default function CalculatorPage() {
  const [inp, setInp] = useState(D);
  const [openS, setOpenS] = useState<Record<string, boolean>>({ acq: true, con: false, soft: false, fin: false, sales: false, hold: false });
  const [tab, setTab] = useState("inputs");
  const [aiText, setAiText] = useState("");
  const [aiLoad, setAiLoad] = useState(false);

  const set = (k: string, v: any) => setInp(p => ({ ...p, [k]: v }));
  const tog = (k: string) => setOpenS(p => ({ ...p, [k]: !p[k] }));

  const res = useCallback(() => {
    const p = inp;
    const sd = calcSD(p.purchasePrice, p.state);
    const acq = (isNaN(p.purchasePrice) ? 0 : p.purchasePrice) + sd + (isNaN(p.legalsDue) ? 0 : p.legalsDue) + (isNaN(p.dueDiligence) ? 0 : p.dueDiligence);
    
    let build = 0, grv = 0;
    if (p.devType === "Subdivision") { 
      build = 25000 + (isNaN(p.provisionalSums) ? 0 : p.provisionalSums); 
      grv = (isNaN(p.subdivisionLots) ? 0 : p.subdivisionLots) * (isNaN(p.lotGRV) ? 0 : p.lotGRV); 
    }
    else if (p.devType === "Commercial") { 
      build = (isNaN(p.commercialBuildCost) ? 0 : p.commercialBuildCost) * (isNaN(p.commercialGFA) ? 0 : p.commercialGFA); 
      grv = (isNaN(p.commercialGRV) ? 0 : p.commercialGRV); 
    }
    else { 
      build = (isNaN(p.buildCostPerSqm) ? 0 : p.buildCostPerSqm) * (isNaN(p.gfa) ? 0 : p.gfa); 
      grv = (isNaN(p.numDwellings) ? 0 : p.numDwellings) * (isNaN(p.grvPerUnit) ? 0 : p.grvPerUnit); 
    }
    
    const cont = build * ((isNaN(p.contingency) ? 0 : p.contingency) / 100);
    const conTotal = build + cont + (isNaN(p.provisionalSums) ? 0 : p.provisionalSums);
    const soft = (isNaN(p.planningPermits) ? 0 : p.planningPermits) + (isNaN(p.designFees) ? 0 : p.designFees) + (isNaN(p.surveying) ? 0 : p.surveying) + (isNaN(p.councilContributions) ? 0 : p.councilContributions) + (isNaN(p.utilityConnections) ? 0 : p.utilityConnections);
    const loanBase = acq + conTotal + soft;
    const loan = loanBase * ((isNaN(p.loanLvr) ? 0 : p.loanLvr) / 100);
    const interest = loan * ((isNaN(p.interestRate) ? 0 : p.interestRate) / 100 / 12) * (isNaN(p.loanTermMonths) ? 0 : p.loanTermMonths);
    const estab = loan * ((isNaN(p.establishmentFee) ? 0 : p.establishmentFee) / 100);
    const fin = interest + estab;
    const hold = ((isNaN(p.councilRates) ? 0 : p.councilRates) + (isNaN(p.insurance) ? 0 : p.insurance) + (isNaN(p.pmFees) ? 0 : p.pmFees)) * ((isNaN(p.holdMonths) ? 0 : p.holdMonths) / 12);
    const agent = grv * ((isNaN(p.agentCommission) ? 0 : p.agentCommission) / 100);
    const gst = p.gstOnSales ? (grv - grv / 1.1) : 0;
    const netRev = grv - agent - (isNaN(p.marketing) ? 0 : p.marketing) - gst;
    const total = acq + conTotal + soft + fin + hold;
    const profit = netRev - total;
    const margin = netRev > 0 ? (profit / netRev) * 100 : 0;
    const roc = total > 0 ? (profit / total) * 100 : 0;
    const eq = loanBase - loan;
    const roe = eq > 0 ? (profit / eq) * 100 : 0;
    
    return { sd, acq, build, cont, conTotal, soft, loan, interest, estab, fin, hold, agent, gst, netRev, grv, total, profit, margin, roc, roe, eq };
  }, [inp])();

  const isGo = res.margin >= 20, isBord = res.margin >= 12 && res.margin < 20;
  const vLabel = isGo ? "Go" : isBord ? "Borderline" : "No-go";

  const runAI = async () => {
    setAiLoad(true); setAiText(""); setTab("ai");
    const s = `Dev:${inp.devType} ${inp.state}|Purchase:$${inp.purchasePrice.toLocaleString()}|SD:$${res.sd.toLocaleString()}|Acq:$${Math.round(res.acq).toLocaleString()}|Build:$${Math.round(res.conTotal).toLocaleString()}|Soft:$${Math.round(res.soft).toLocaleString()}|Finance:$${Math.round(res.fin).toLocaleString()}|Hold:$${Math.round(res.hold).toLocaleString()}|TotalCost:$${Math.round(res.total).toLocaleString()}|GRV:$${Math.round(res.grv).toLocaleString()}|NetRev:$${Math.round(res.netRev).toLocaleString()}|NetProfit:$${Math.round(res.profit).toLocaleString()}|Margin:${res.margin.toFixed(1)}%|ROC:${res.roc.toFixed(1)}%|ROE:${res.roe.toFixed(1)}%|LVR:${inp.loanLvr}%|Rate:${inp.interestRate}%|Term:${inp.loanTermMonths}mo`;
    try {
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 900,
          system: "You are a senior Australian property development analyst. Respond in plain text only — no markdown, no asterisks, no hash symbols. Use exactly this structure with these exact headings on their own lines:\n\nVERDICT\n[2-3 sentence summary with specific numbers]\n\nKEY RISKS\n- risk one\n- risk two\n- risk three\n\nSUGGESTIONS\n- suggestion one\n- suggestion two\n- suggestion three\n\nBe direct and specific.",
          messages: [{ role: "user", content: `Analyse:\n${s}` }]
        })
      });
      const d = await resp.json();
      if (d.error) {
        setAiText(d.error);
      } else {
        setAiText(d.content?.find((b: any) => b.type === "text")?.text || "Unavailable.");
      }
    } catch { setAiText("Analysis failed. Please try again."); }
    setAiLoad(false);
  };

  const renderAI = () => {
    if (!aiText) return null;
    return aiText.split("\n").map((line, i) => {
      const t = line.trim();
      if (!t) return <div key={i} className="h-1" />;
      if (["VERDICT", "KEY RISKS", "SUGGESTIONS"].includes(t)) return <div key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3 mb-1.5 first:mt-0">{t}</div>;
      if (t.startsWith("-")) return (
        <div key={i} className="flex gap-2 text-sm text-[#333] leading-relaxed mb-1" shadow-sm>
          <div className="w-1 h-1 rounded-full bg-gray-300 mt-2 shrink-0" />
          <div>{t.slice(1).trim()}</div>
        </div>
      );
      return <div key={i} className="text-sm text-[#333] leading-relaxed mb-2">{t}</div>;
    });
  };

  const bars = [
    { label: "Purchase price", v: isNaN(inp.purchasePrice) ? 0 : inp.purchasePrice, c: "bg-[#4a9eff]" },
    { label: "Stamp duty", v: res.sd, c: "bg-[#4a9eff]" },
    { label: "Construction", v: res.build, c: "bg-[#34c759]" },
    { label: "Contingency", v: res.cont, c: "bg-[#34c759]" },
    { label: "Soft costs", v: res.soft, c: "bg-[#bf5af2]" },
    { label: "Finance costs", v: res.fin, c: "bg-[#ff9f0a]" },
    { label: "Holding costs", v: res.hold, c: "bg-[#8e8e93]" },
    { label: "Sales & GST", v: res.agent + (isNaN(inp.marketing) ? 0 : inp.marketing) + res.gst, c: "bg-[#ff6b6b]" },
  ];
  const maxBar = Math.max(...bars.map(b => b.v), 1);

  const InputsPane = (
    <div className="space-y-1">
      <Sec id="acq" title="Acquisition" sum={$(res.acq)} isOpen={openS.acq} onToggle={() => tog("acq")}>
        <FR label="State">
          <select 
            value={inp.state} 
            onChange={e => set("state", e.target.value)}
            className="text-xs px-2 py-1.5 border border-[#e0ded8] rounded-md bg-[#fafaf9] text-[#1c1c1e] outline-none cursor-pointer focus:border-[#4a9eff]"
          >
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FR>
        <FR label="Purchase price"><NI val={inp.purchasePrice} onChange={v => set("purchasePrice", v)} step={5000} pre="$" /></FR>
        <FR label="Stamp duty" sub="Auto-calculated" auto={$(res.sd)} />
        <FR label="Legals"><NI val={inp.legalsDue} onChange={v => set("legalsDue", v)} step={500} pre="$" /></FR>
        <FR label="Due diligence"><NI val={inp.dueDiligence} onChange={v => set("dueDiligence", v)} step={500} pre="$" /></FR>
      </Sec>
      <Sec id="con" title="Construction" sum={$(res.conTotal)} isOpen={openS.con} onToggle={() => tog("con")}>
        {(inp.devType === "Multi-Dwelling" || inp.devType === "Knockdown Rebuild") && <>
          <FR label="Build cost / m²"><NI val={inp.buildCostPerSqm} onChange={v => set("buildCostPerSqm", v)} step={50} pre="$" /></FR>
          <FR label="Gross floor area"><NI val={inp.gfa} onChange={v => set("gfa", v)} step={10} suf="m²" /></FR>
          <FR label="No. of dwellings"><NI val={inp.numDwellings} onChange={v => set("numDwellings", v)} step={1} min={1} /></FR>
        </>}
        {inp.devType === "Commercial" && <>
          <FR label="Build cost / m²"><NI val={inp.commercialBuildCost} onChange={v => set("commercialBuildCost", v)} step={50} pre="$" /></FR>
          <FR label="Gross floor area"><NI val={inp.commercialGFA} onChange={v => set("commercialGFA", v)} step={10} suf="m²" /></FR>
        </>}
        {inp.devType === "Subdivision" && <FR label="Site prep" auto="$25,000 est." />}
        <FR label="Contingency"><NI val={inp.contingency} onChange={v => set("contingency", v)} step={1} suf="%" /></FR>
        <FR label="Provisional sums"><NI val={inp.provisionalSums} onChange={v => set("provisionalSums", v)} step={1000} pre="$" /></FR>
      </Sec>
      <Sec id="soft" title="Soft costs" sum={$(res.soft)} isOpen={openS.soft} onToggle={() => tog("soft")}>
        <FR label="Planning & permits"><NI val={inp.planningPermits} onChange={v => set("planningPermits", v)} step={500} pre="$" /></FR>
        <FR label="Design fees"><NI val={inp.designFees} onChange={v => set("designFees", v)} step={500} pre="$" /></FR>
        <FR label="Surveying"><NI val={inp.surveying} onChange={v => set("surveying", v)} step={500} pre="$" /></FR>
        <FR label="Council contributions"><NI val={inp.councilContributions} onChange={v => set("councilContributions", v)} step={1000} pre="$" /></FR>
        <FR label="Utility connections"><NI val={inp.utilityConnections} onChange={v => set("utilityConnections", v)} step={500} pre="$" /></FR>
      </Sec>
      <Sec id="fin" title="Financing" sum={$(res.fin)} isOpen={openS.fin} onToggle={() => tog("fin")}>
        <FR label="Loan LVR"><NI val={inp.loanLvr} onChange={v => set("loanLvr", v)} step={1} suf="%" /></FR>
        <FR label="Interest rate p.a."><NI val={inp.interestRate} onChange={v => set("interestRate", v)} step={0.1} suf="%" /></FR>
        <FR label="Loan term"><NI val={inp.loanTermMonths} onChange={v => set("loanTermMonths", v)} step={1} suf="mo" /></FR>
        <FR label="Establishment fee"><NI val={inp.establishmentFee} onChange={v => set("establishmentFee", v)} step={0.1} suf="%" /></FR>
      </Sec>
      <Sec id="sales" title="Sales & exit" sum={$(res.grv)} isOpen={openS.sales} onToggle={() => tog("sales")}>
        {(inp.devType === "Multi-Dwelling" || inp.devType === "Knockdown Rebuild") && <FR label="GRV per dwelling"><NI val={inp.grvPerUnit} onChange={v => set("grvPerUnit", v)} step={10000} pre="$" /></FR>}
        {inp.devType === "Subdivision" && <>
          <FR label="No. of lots"><NI val={inp.subdivisionLots} onChange={v => set("subdivisionLots", v)} step={1} min={2} /></FR>
          <FR label="GRV per lot"><NI val={inp.lotGRV} onChange={v => set("lotGRV", v)} step={10000} pre="$" /></FR>
        </>}
        {inp.devType === "Commercial" && <FR label="Total GRV"><NI val={inp.commercialGRV} onChange={v => set("commercialGRV", v)} step={50000} pre="$" /></FR>}
        <FR label="Agent commission"><NI val={inp.agentCommission} onChange={v => set("agentCommission", v)} step={0.1} suf="%" /></FR>
        <FR label="Marketing"><NI val={inp.marketing} onChange={v => set("marketing", v)} step={1000} pre="$" /></FR>
        <FR label="GST on sales">
          <button 
            className={`w-9 h-5 rounded-full relative cursor-pointer border-none shrink-0 transition-colors duration-200 ${inp.gstOnSales ? "bg-[#34c759]" : "bg-[#d1d0ce]"}`}
            onClick={() => set("gstOnSales", !inp.gstOnSales)}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm ${inp.gstOnSales ? "left-[18px]" : "left-0.5"}`} />
          </button>
        </FR>
      </Sec>
      <Sec id="hold" title="Holding costs" sum={$(res.hold)} isOpen={openS.hold} onToggle={() => tog("hold")}>
        <FR label="Hold period"><NI val={inp.holdMonths} onChange={v => set("holdMonths", v)} step={1} suf="mo" /></FR>
        <FR label="Council rates p.a."><NI val={inp.councilRates} onChange={v => set("councilRates", v)} step={100} pre="$" /></FR>
        <FR label="Insurance p.a."><NI val={inp.insurance} onChange={v => set("insurance", v)} step={100} pre="$" /></FR>
        <FR label="PM fees p.a."><NI val={inp.pmFees} onChange={v => set("pmFees", v)} step={500} pre="$" /></FR>
      </Sec>
      <button className="w-full p-3 rounded-lg bg-[#1c1c1e] text-white text-sm font-semibold cursor-pointer active:opacity-80 mt-2 transition-all" onClick={() => setTab("results")}>View results</button>
    </div>
  );

  const ResultsPane = (
    <div className="space-y-3">
      <div className={`flex justify-between items-center p-4 rounded-xl border ${
        isGo ? "bg-[#f0fdf4] border-[#bbf7d0]" : 
        isBord ? "bg-[#fffbeb] border-[#fed7aa]" : 
        "bg-[#fff5f5] border-[#fecaca]"
      }`}>
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
            isGo ? "text-green-800" : isBord ? "text-orange-800" : "text-red-800"
          }`}>Verdict</div>
          <div className={`text-3xl font-bold leading-none ${
            isGo ? "text-green-600" : isBord ? "text-orange-600" : "text-red-600"
          }`}>{vLabel}</div>
          <div className={`text-xs mt-1 font-medium ${
            isGo ? "text-green-800" : isBord ? "text-orange-800" : "text-red-800"
          }`}>{isGo ? "Strong margin — viable" : isBord ? "Proceed with caution" : "Insufficient margin"}</div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
            isGo ? "text-green-800" : isBord ? "text-orange-800" : "text-red-800"
          }`}>Net margin</div>
          <div className={`text-3xl font-bold leading-none ${
            isGo ? "text-green-600" : isBord ? "text-orange-600" : "text-red-600"
          }`}>{pct(res.margin)}</div>
          <div className={`text-xs mt-1 font-medium ${
            isGo ? "text-green-800" : isBord ? "text-orange-800" : "text-red-800"
          }`}>Target ≥ 20%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl border border-[#e0ded8] p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Net profit</div>
          <div className={`text-xl font-bold leading-none ${res.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{$(res.profit)}</div>
          <div className="text-[10px] text-gray-400 mt-1">after all costs</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e0ded8] p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Gross revenue</div>
          <div className="text-xl font-bold leading-none text-[#1c1c1e]">{$(res.grv)}</div>
          <div className="text-[10px] text-gray-400 mt-1">before deductions</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e0ded8] p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Return on cost</div>
          <div className="text-xl font-bold leading-none text-[#1c1c1e]">{pct(res.roc)}</div>
          <div className="text-[10px] text-gray-400 mt-1">profit ÷ total cost</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e0ded8] p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Return on equity</div>
          <div className="text-xl font-bold leading-none text-[#1c1c1e]">{pct(res.roe)}</div>
          <div className="text-[10px] text-gray-400 mt-1">equity: {$(res.eq)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0ded8] overflow-hidden shadow-sm">
        <div className="px-3.5 py-2.5 bg-gray-50 border-b border-[#ece9e3]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost breakdown</span>
        </div>
        <div className="p-3.5 space-y-3">
          {bars.map((b, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{b.label}</span>
                <span className="font-semibold text-[#1c1c1e] tabular-nums">{$(b.v)}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${b.c}`} style={{ width: (b.v / maxBar * 100) + "%" }} />
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2.5 border-t border-gray-100 mt-0.5">
            <span className="text-xs font-bold text-[#1c1c1e]">Total project cost</span>
            <span className="text-xs font-bold text-[#1c1c1e] tabular-nums">{$(res.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0ded8] overflow-hidden shadow-sm">
        <div className="px-3.5 py-2.5 bg-gray-50 border-b border-[#ece9e3]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">P&L summary</span>
        </div>
        {[
          ["Gross revenue", $(res.grv), false, false],
          ["Less: GST", $(res.gst > 0 ? -res.gst : 0), false, true],
          ["Less: Agent & marketing", $(-(res.agent + (isNaN(inp.marketing) ? 0 : inp.marketing))), false, true],
          ["Net revenue", $(res.netRev), true, false],
          ["Less: Total project cost", $(res.total > 0 ? -res.total : 0), false, true],
          ["Net profit", $(res.profit), true, false, res.profit >= 0 ? "text-green-600" : "text-red-600"],
        ].map(([lbl, val, bold, muted, col], i) => (
          <div key={i} className={`flex justify-between items-center px-3.5 py-2 border-b border-gray-50 last:border-b-0 ${bold ? "bg-gray-50/80" : ""} ${muted ? "text-gray-400" : "text-[#1c1c1e]"}`}>
            <span className={`text-xs ${bold ? "font-bold" : "font-medium"}`}>{lbl as string}</span>
            <span className={`text-xs tabular-nums ${bold ? "font-bold" : "font-semibold"} ${col ? col as string : ""}`}>{val as string}</span>
          </div>
        ))}
      </div>
      <button className="w-full p-3 rounded-lg bg-[#0a84ff] text-white text-sm font-semibold cursor-pointer active:opacity-80 transition-all hover:bg-blue-600 shadow-sm" onClick={runAI}>Get AI analysis</button>
    </div>
  );

  const AIPane = (
    <div>
      {aiLoad && (
        <div className="py-12 px-6 text-center text-sm text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-100 border-t-[#4a9eff] rounded-full animate-spin mx-auto mb-3" />
          Analysing feasibility...
        </div>
      )}
      {!aiLoad && !aiText && (
        <div className="py-12 px-6 text-center">
          <div className="w-11 h-11 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="4" stroke="#aaa" strokeWidth="1.5" /><path d="M7 10h6M10 7v6" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <div className="text-sm font-semibold text-[#1c1c1e] mb-1.5">AI analysis</div>
          <div className="text-xs text-gray-400 mb-5 leading-relaxed text-balance">Get a written verdict, risk flags, and suggestions based on your numbers.</div>
          <button className="inline-block py-2.5 px-7 rounded-lg bg-[#0a84ff] text-white text-sm font-semibold cursor-pointer active:opacity-80 transition-all shadow-sm" onClick={runAI}>Run analysis</button>
        </div>
      )}
      {!aiLoad && aiText && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-[#e0ded8] p-4 shadow-sm">
            {renderAI()}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-[#e0ded8] p-3.5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Net margin</div>
              <div className={`text-xl font-bold leading-none ${isGo ? "text-green-600" : isBord ? "text-orange-600" : "text-red-600"}`}>{pct(res.margin)}</div>
            </div>
            <div className="bg-white rounded-xl border border-[#e0ded8] p-3.5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Net profit</div>
              <div className={`text-xl font-bold leading-none ${res.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{$(res.profit)}</div>
            </div>
          </div>
          <button className="w-full p-2.5 rounded-lg bg-white text-gray-500 border border-[#e0ded8] text-xs font-medium cursor-pointer active:opacity-80 transition-all hover:bg-gray-50" onClick={runAI}>Regenerate analysis</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#f5f4f2] min-h-screen flex flex-col md:grid md:grid-cols-[210px_1fr] md:overflow-hidden md:border md:border-[#d0cec8] md:rounded-xl md:m-5">
      
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex flex-col bg-[#1c1c1e]">
        <div className="p-[18px_16px_14px] border-b border-[#2c2c2e]">
          <div className="text-xs font-bold text-white tracking-widest uppercase">Athena</div>
          <div className="text-[11px] text-[#555] mt-1">Feasibility calculator</div>
        </div>
        <div className="py-2 flex-1 overflow-y-auto">
          <div className="px-4 py-3.5 text-[10px] font-bold text-[#444] uppercase tracking-widest">View</div>
          {NAV_TABS.map(t => (
            <button key={t} className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm transition-colors w-full text-left ${tab === t ? "text-white bg-[#2c2c2e]" : "text-[#888] hover:text-gray-300 hover:bg-[#252527]"}`} onClick={() => setTab(t)}>
              <div className={`w-1.5 h-1.5 rounded-full ${tab === t ? "bg-[#4a9eff]" : "bg-[#333]"}`} />
              {t === "ai" ? "AI analysis" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <div className="px-4 py-3.5 text-[10px] font-bold text-[#444] uppercase tracking-widest mt-2">Dev type</div>
          {DEV_NAV.map(t => (
            <button key={t} className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm transition-colors w-full text-left ${inp.devType === t ? "text-white bg-[#2c2c2e]" : "text-[#888] hover:text-gray-300 hover:bg-[#252527]"}`} onClick={() => set("devType", t)}>
              <div className={`w-1.5 h-1.5 rounded-full ${inp.devType === t ? "bg-[#4a9eff]" : "bg-[#333]"}`} />
              {t}
            </button>
          ))}
        </div>
        <div className={`p-4 m-2 rounded-lg transition-colors ${
          isGo ? "bg-[#0d2818]" : isBord ? "bg-[#2a1f00]" : "bg-[#2a0a0a]"
        }`}>
          <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${
            isGo ? "text-[#34c759]" : isBord ? "text-[#ff9f0a]" : "text-[#ff453a]"
          }`}>Verdict</div>
          <div className={`text-2xl font-bold leading-none ${
            isGo ? "text-[#34c759]" : isBord ? "text-[#ff9f0a]" : "text-[#ff453a]"
          }`}>{vLabel}</div>
          <div className="text-[11px] text-[#555] mt-1">{pct(res.margin)} net margin</div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-[#1c1c1e] p-3 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-white tracking-widest uppercase">Athena</div>
          <div className={`rounded-lg py-1.5 px-3 text-right max-w-[150px] ${
            isGo ? "bg-[#0d2818]" : isBord ? "bg-[#2a1f00]" : "bg-[#2a0a0a]"
          }`}>
            <div className={`text-[9px] font-bold tracking-widest uppercase ${
              isGo ? "text-[#34c759]" : isBord ? "text-[#ff9f0a]" : "text-[#ff453a]"
            }`}>Verdict</div>
            <div className={`text-base font-bold leading-tight line-clamp-1 ${
              isGo ? "text-[#34c759]" : isBord ? "text-[#ff9f0a]" : "text-[#ff453a]"
            }`}>{vLabel} · {pct(res.margin)}</div>
          </div>
        </div>
        <div className="flex gap-1">
          {NAV_TABS.map(t => (
            <button key={t} className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-semibold transition-colors ${tab === t ? "bg-[#3a3a3c] text-white" : "bg-[#2c2c2e] text-[#888]"}`} onClick={() => setTab(t)}>
              {t === "ai" ? "AI" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {DEV_NAV.map(t => (
            <button key={t} className={`text-[11px] py-1 px-2.5 rounded-full border whitespace-nowrap transition-all ${inp.devType === t ? "bg-white text-[#1c1c1e] border-white" : "bg-transparent text-[#666] border-[#3a3a3c]"}`} onClick={() => set("devType", t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col bg-[#f5f4f2] overflow-y-auto relative">
        <div className="flex items-center gap-2 p-2.5 bg-[#f0efed] border-b border-[#d8d6d0] md:sticky md:top-0 md:left-0 md:right-0 md:z-10 md:m-0 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">State</span>
            <select 
              value={inp.state} 
              onChange={e => set("state", e.target.value)}
              className="text-[11px] px-2 py-0.5 border border-[#e0ded8] rounded-md bg-[#fafaf9] text-[#1c1c1e] outline-none cursor-pointer"
            >
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="text-gray-300 mx-1 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 mr-auto">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stamp duty</span>
            <span className="text-[11px] font-bold text-[#444]">{$(res.sd)}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cost</span>
              <span className="text-[11px] font-bold text-[#444] tracking-tight">{$(res.total)}</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Profit</span>
              <span className={`text-[11px] font-bold tracking-tight ${res.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{$(res.profit)}</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 flex-1 contents-area">
          {tab === "inputs" && InputsPane}
          {tab === "results" && ResultsPane}
          {tab === "ai" && AIPane}
        </div>
      </div>

    </div>
  );
}
