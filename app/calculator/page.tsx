"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

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
  surveyFeature: 2500,
  surveyReestab: 1800,
  tpDrawings: 12000,
  tpReport: 4000,
  tpPermitFee: 1800,
  subdivisionAppFee: 1496,
  certificationFee: 198,
  conveyancing: 3000,
  soilTest: 900,
  structEngineering: 6000,
  civilEngineering: 5000,
  energyRating: 1200,
  buildingPermit: 4500,
};

const $ = (n: number) => isNaN(n) ? "$0" : "$" + Math.round(n).toLocaleString("en-AU");
const pct = (n: number) => isFinite(n) ? n.toFixed(1) + "%" : "—";

// Components defined outside to prevent focus loss on rerender
const NI = ({ val, onChange, step = 1, min = 0, pre, suf }: { val: number, onChange: (v: number) => void, step?: number, min?: number, pre?: string, suf?: string }) => (
  <div className="flex items-center gap-1 shrink-0">
    {pre && <span className="text-xs text-on-surface-variant/60">{pre}</span>}
    <input
      type="number"
      value={isNaN(val) ? "" : val}
      min={min}
      step={step}
      onChange={e => onChange(e.target.value === "" ? NaN : parseFloat(e.target.value))}
      onFocus={e => e.target.select()}
      className="w-[140px] text-sm px-3 py-2 border border-outline-variant/30 rounded-lg bg-surface-container-low text-foreground text-right outline-none focus:border-primary focus:bg-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
    />
    {suf && <span className="text-xs text-on-surface-variant/60">{suf}</span>}
  </div>
);

const FR = ({ label, sub, children, auto }: { label: string, sub?: string, children?: React.ReactNode, auto?: string }) => (
  <div className="flex justify-between items-center px-4 py-3.5 border-b border-outline-variant/10 gap-2 last:border-b-0">
    <div className="flex-1 min-w-0">
      <div className="text-[13px] text-foreground font-semibold">{label}</div>
      {sub && <div className="text-[11px] text-on-surface-variant mt-0.5">{sub}</div>}
    </div>
    {auto ? <span className="text-[13px] text-on-surface-variant italic whitespace-nowrap">{auto}</span> : <div>{children}</div>}
  </div>
);

const Sec = ({ id, title, sum, children, isOpen, onToggle }: { id: string, title: string, sum?: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
  <div className="bg-background rounded-2xl border border-outline-variant/20 mb-3 overflow-hidden shadow-sm">
    <div 
      className={`flex justify-between items-center px-4 py-4 cursor-pointer select-none hover:bg-surface-container-low transition-colors ${isOpen ? "bg-surface-container-low border-b border-outline-variant/10" : ""}`} 
      onClick={onToggle}
    >
      <span className="text-sm font-bold text-foreground tracking-tight">{title}</span>
      <div className="flex items-center">
        {!isOpen && sum && <span className="text-xs font-bold text-primary mr-3">{sum}</span>}
        <span className={`text-[10px] text-on-surface-variant transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4"/></svg>
        </span>
      </div>
    </div>
    {isOpen && <div className="bg-background">{children}</div>}
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
    const soft = (isNaN(p.planningPermits) ? 0 : p.planningPermits) + 
                 (isNaN(p.designFees) ? 0 : p.designFees) + 
                 (isNaN(p.surveying) ? 0 : p.surveying) + 
                 (isNaN(p.councilContributions) ? 0 : p.councilContributions) + 
                 (isNaN(p.utilityConnections) ? 0 : p.utilityConnections) +
                 (isNaN(p.surveyFeature) ? 0 : p.surveyFeature) +
                 (isNaN(p.surveyReestab) ? 0 : p.surveyReestab) +
                 (isNaN(p.tpDrawings) ? 0 : p.tpDrawings) +
                 (isNaN(p.tpReport) ? 0 : p.tpReport) +
                 (isNaN(p.tpPermitFee) ? 0 : p.tpPermitFee) +
                 (isNaN(p.subdivisionAppFee) ? 0 : p.subdivisionAppFee) +
                 (isNaN(p.certificationFee) ? 0 : p.certificationFee) +
                 (isNaN(p.conveyancing) ? 0 : p.conveyancing) +
                 (isNaN(p.soilTest) ? 0 : p.soilTest) +
                 (isNaN(p.structEngineering) ? 0 : p.structEngineering) +
                 (isNaN(p.civilEngineering) ? 0 : p.civilEngineering) +
                 (isNaN(p.energyRating) ? 0 : p.energyRating) +
                 (isNaN(p.buildingPermit) ? 0 : p.buildingPermit);
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
  const vLabel = isGo ? "Viable" : isBord ? "Borderline" : "No-Go";

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
      if (["VERDICT", "KEY RISKS", "SUGGESTIONS"].includes(t)) return <div key={i} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-5 mb-2 first:mt-0">{t}</div>;
      if (t.startsWith("-")) return (
        <div key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed mb-1.5 px-1">
          <div className="w-1 h-1 rounded-full bg-primary/40 mt-2 shrink-0" />
          <div>{t.slice(1).trim()}</div>
        </div>
      );
      return <div key={i} className="text-sm text-foreground/90 leading-relaxed mb-3">{t}</div>;
    });
  };

  const bars = [
    { label: "Purchase Price", v: isNaN(inp.purchasePrice) ? 0 : inp.purchasePrice, c: "bg-primary" },
    { label: "Stamp Duty", v: res.sd, c: "bg-primary/60" },
    { label: "Construction", v: res.build, c: "bg-secondary" },
    { label: "Contingency", v: res.cont, c: "bg-secondary/60" },
    { label: "Soft Costs", v: res.soft, c: "bg-primary/40" },
    { label: "Finance Costs", v: res.fin, c: "bg-secondary/40" },
    { label: "Holding Costs", v: res.hold, c: "bg-on-surface-variant/40" },
    { label: "Sales & GST", v: res.agent + (isNaN(inp.marketing) ? 0 : inp.marketing) + res.gst, c: "bg-on-surface-variant/20" },
  ];
  const maxBar = Math.max(...bars.map(b => b.v), 1);

  const InputsPane = (
    <div className="space-y-4">
      <Sec id="acq" title="Acquisition" sum={$(res.acq)} isOpen={openS.acq} onToggle={() => tog("acq")}>
        <FR label="State">
          <select 
            value={inp.state} 
            onChange={e => set("state", e.target.value)}
            className="text-xs px-3 py-2 border border-outline-variant/30 rounded-lg bg-surface-container-low text-foreground outline-none cursor-pointer focus:border-primary transition-all"
          >
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FR>
        <FR label="Purchase Price"><NI val={inp.purchasePrice} onChange={v => set("purchasePrice", v)} step={5000} pre="$" /></FR>
        <FR label="Stamp Duty" sub="Estimated (VIC/NSW/etc)" auto={$(res.sd)} />
        <FR label="Legal Fees" sub="Conveyancing, contracts"><NI val={inp.legalsDue} onChange={v => set("legalsDue", v)} step={500} pre="$" /></FR>
        <FR label="Due Diligence" sub="Consultants, reports"><NI val={inp.dueDiligence} onChange={v => set("dueDiligence", v)} step={500} pre="$" /></FR>
      </Sec>
      
      <Sec id="con" title="Construction" sum={$(res.conTotal)} isOpen={openS.con} onToggle={() => tog("con")}>
        {(inp.devType === "Multi-Dwelling" || inp.devType === "Knockdown Rebuild") && <>
          <FR label="Build rate per m²"><NI val={inp.buildCostPerSqm} onChange={v => set("buildCostPerSqm", v)} step={50} pre="$" /></FR>
          <FR label="Total area (GFA)"><NI val={inp.gfa} onChange={v => set("gfa", v)} step={10} suf="m²" /></FR>
          <FR label="No. of dwellings"><NI val={inp.numDwellings} onChange={v => set("numDwellings", v)} step={1} min={1} /></FR>
        </>}
        {inp.devType === "Commercial" && <>
          <FR label="Build rate per m²"><NI val={inp.commercialBuildCost} onChange={v => set("commercialBuildCost", v)} step={50} pre="$" /></FR>
          <FR label="Total area (GFA)"><NI val={inp.commercialGFA} onChange={v => set("commercialGFA", v)} step={10} suf="m²" /></FR>
        </>}
        {inp.devType === "Subdivision" && <FR label="Base preparation" auto="$25,000 est." />}
        <FR label="Contingency"><NI val={inp.contingency} onChange={v => set("contingency", v)} step={1} suf="%" /></FR>
        <FR label="Direct/Prov. Sums"><NI val={inp.provisionalSums} onChange={v => set("provisionalSums", v)} step={1000} pre="$" /></FR>
      </Sec>

      <Sec id="soft" title="Soft Costs" sum={$(res.soft)} isOpen={openS.soft} onToggle={() => tog("soft")}>
        <div className="px-4 py-2 bg-surface-container-low/50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Surveying & Planning</div>
        <FR label="Feature Survey"><NI val={inp.surveyFeature} onChange={v => set("surveyFeature", v)} step={100} pre="$" /></FR>
        <FR label="Re-establishment"><NI val={inp.surveyReestab} onChange={v => set("surveyReestab", v)} step={100} pre="$" /></FR>
        <FR label="Town Planning Docs"><NI val={inp.tpDrawings} onChange={v => set("tpDrawings", v)} step={500} pre="$" /></FR>
        <FR label="Planning Report"><NI val={inp.tpReport} onChange={v => set("tpReport", v)} step={500} pre="$" /></FR>
        
        <div className="px-4 py-2 bg-surface-container-low/50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-y border-outline-variant/10">Statutory & Permitting</div>
        <FR label="TP Permit Fee"><NI val={inp.tpPermitFee} onChange={v => set("tpPermitFee", v)} step={100} pre="$" /></FR>
        <FR label="Subdivision Application"><NI val={inp.subdivisionAppFee} onChange={v => set("subdivisionAppFee", v)} step={50} pre="$" /></FR>
        <FR label="Council contributions" sub="DCP/S801"><NI val={inp.councilContributions} onChange={v => set("councilContributions", v)} step={1000} pre="$" /></FR>

        <div className="px-4 py-2 bg-surface-container-low/50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-y border-outline-variant/10">Engineering & Tech</div>
        <FR label="Soil / Geotech"><NI val={inp.soilTest} onChange={v => set("soilTest", v)} step={50} pre="$" /></FR>
        <FR label="Structural Engineering"><NI val={inp.structEngineering} onChange={v => set("structEngineering", v)} step={500} pre="$" /></FR>
        <FR label="Civil / Drainage"><NI val={inp.civilEngineering} onChange={v => set("civilEngineering", v)} step={500} pre="$" /></FR>
        <FR label="Utility connections"><NI val={inp.utilityConnections} onChange={v => set("utilityConnections", v)} step={500} pre="$" /></FR>
      </Sec>

      <Sec id="fin" title="Finance" sum={$(res.fin)} isOpen={openS.fin} onToggle={() => tog("fin")}>
        <FR label="Loan LVR"><NI val={inp.loanLvr} onChange={v => set("loanLvr", v)} step={1} suf="%" /></FR>
        <FR label="Interest Rate p.a."><NI val={inp.interestRate} onChange={v => set("interestRate", v)} step={0.1} suf="%" /></FR>
        <FR label="Loan Term"><NI val={inp.loanTermMonths} onChange={v => set("loanTermMonths", v)} step={1} suf="mo" /></FR>
        <FR label="Establishment Fee"><NI val={inp.establishmentFee} onChange={v => set("establishmentFee", v)} step={0.1} suf="%" /></FR>
      </Sec>

      <Sec id="sales" title="Sales & Revenue" sum={$(res.grv)} isOpen={openS.sales} onToggle={() => tog("sales")}>
        {(inp.devType === "Multi-Dwelling" || inp.devType === "Knockdown Rebuild") && <FR label="Avg sale price"><NI val={inp.grvPerUnit} onChange={v => set("grvPerUnit", v)} step={10000} pre="$" /></FR>}
        {inp.devType === "Subdivision" && <>
          <FR label="Number of lots"><NI val={inp.subdivisionLots} onChange={v => set("subdivisionLots", v)} step={1} min={2} /></FR>
          <FR label="Sale price per lot"><NI val={inp.lotGRV} onChange={v => set("lotGRV", v)} step={10000} pre="$" /></FR>
        </>}
        {inp.devType === "Commercial" && <FR label="Total Sale Value"><NI val={inp.commercialGRV} onChange={v => set("commercialGRV", v)} step={50000} pre="$" /></FR>}
        <FR label="Agent commission"><NI val={inp.agentCommission} onChange={v => set("agentCommission", v)} step={0.1} suf="%" /></FR>
        <FR label="Marketing budget"><NI val={inp.marketing} onChange={v => set("marketing", v)} step={1000} pre="$" /></FR>
        <FR label="GST on Sales (Net)">
          <button 
            className={`w-10 h-6 rounded-full relative cursor-pointer border-none shrink-0 transition-colors duration-300 ${inp.gstOnSales ? "bg-primary" : "bg-outline-variant/30"}`}
            onClick={() => set("gstOnSales", !inp.gstOnSales)}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${inp.gstOnSales ? "left-[20px]" : "left-1"}`} />
          </button>
        </FR>
      </Sec>

      <Sec id="hold" title="Holding Costs" sum={$(res.hold)} isOpen={openS.hold} onToggle={() => tog("hold")}>
        <FR label="Hold period"><NI val={inp.holdMonths} onChange={v => set("holdMonths", v)} step={1} suf="mo" /></FR>
        <FR label="Council rates p.a."><NI val={inp.councilRates} onChange={v => set("councilRates", v)} step={100} pre="$" /></FR>
        <FR label="Site Insurance p.a."><NI val={inp.insurance} onChange={v => set("insurance", v)} step={100} pre="$" /></FR>
      </Sec>

      <button className="w-full py-4 rounded-xl bg-primary text-on-primary text-sm font-bold cursor-pointer hover:opacity-90 active:scale-[0.98] mt-4 transition-all shadow-lg shadow-primary/20" onClick={() => setTab("results")}>View Analysis</button>
    </div>
  );

  const ResultsPane = (
    <div className="space-y-6">
      <div className={`relative overflow-hidden p-8 rounded-[32px] border transition-all duration-500 shadow-2xl ${
        isGo ? "bg-primary border-primary/20 text-white shadow-primary/20" : 
        isBord ? "bg-secondary border-secondary/20 text-white shadow-secondary/20" : 
        "bg-foreground border-outline-variant/20 text-white shadow-black/20"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60">Strategic Verdict</div>
            <div className="text-5xl font-extrabold leading-none tracking-tighter mb-2">{vLabel}</div>
            <div className="text-sm font-bold opacity-80">{isGo ? "Exceeds 20% target" : isBord ? "Within marginal range" : "Fails financial feasibility"}</div>
          </div>
          <div className="h-px w-full md:h-16 md:w-px bg-white/20" />
          <div className="md:text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60">Project Net Margin</div>
            <div className="text-5xl font-extrabold leading-none tracking-tighter mb-2">{pct(res.margin)}</div>
            <div className="text-sm font-bold opacity-80">Target Performance: 20%+</div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-outline-variant/20 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-1">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Net Profit</div>
            <div className={`w-2 h-2 rounded-full ${res.profit >= 0 ? "bg-primary" : "bg-secondary"}`} />
          </div>
          <div className={`text-3xl font-extrabold leading-none tracking-tight ${res.profit >= 0 ? "text-foreground" : "text-secondary"}`}>{$(res.profit)}</div>
          <div className="text-[11px] text-on-surface-variant/60 mt-3 font-medium flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Estimated project return
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-outline-variant/20 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Gross Revenue</div>
          <div className="text-3xl font-extrabold leading-none tracking-tight text-foreground">{$(res.grv)}</div>
          <div className="text-[11px] text-on-surface-variant/60 mt-3 font-medium flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11"/></svg>
            Total project realization
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-outline-variant/20 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Return On Cost</div>
          <div className="text-3xl font-extrabold leading-none tracking-tight text-foreground">{pct(res.roc)}</div>
          <div className="text-[11px] text-on-surface-variant/60 mt-3 font-medium flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Yield on investment
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-outline-variant/20 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Equity Required</div>
          <div className="text-3xl font-extrabold leading-none tracking-tight text-foreground">{$(res.eq)}</div>
          <div className="text-[11px] text-on-surface-variant/60 mt-3 font-medium flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {pct(res.roe)} Return on equity
          </div>
        </div>
      </div>


      <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Expense Allocation</span>
          <span className="text-xs font-bold text-foreground/40 italic">Normalized figures</span>
        </div>
        <div className="p-8 space-y-5">
          {bars.map((b, i) => (
            <div key={i} className="group">
              <div className="flex justify-between text-[11px] font-bold text-foreground/60 uppercase tracking-widest mb-2 transition-colors group-hover:text-foreground">
                <span>{b.label}</span>
                <span className="tabular-nums text-foreground">{$(b.v)}</span>
              </div>
              <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${b.c}`} 
                  style={{ width: (b.v / maxBar * 100) + "%" }} 
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-6 border-t border-dashed border-outline-variant/30 mt-4 items-baseline">
            <span className="text-sm font-bold text-foreground uppercase tracking-widest opacity-40">Total Project Outlay</span>
            <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">{$(res.total)}</span>
          </div>
        </div>
      </div>

      
      <button className="w-full py-4 rounded-xl bg-primary text-on-primary text-sm font-bold cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20" onClick={runAI}>Run Intelligence Engine</button>
    </div>
  );

  const AIPane = (
    <div className="max-w-3xl mx-auto">
      {aiLoad && (
        <div className="py-24 px-6 text-center">
          <div className="relative w-16 h-16 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
          <div className="text-xl font-bold tracking-tight text-foreground">Intelligence Synthesis</div>
          <p className="text-sm mt-3 text-on-surface-variant max-w-xs mx-auto">Our Advisory Engine is analyzing market trends, risk variables, and financial thresholds...</p>
        </div>
      )}
      
      {!aiLoad && !aiText && (
        <div className="py-24 px-10 text-center bg-white rounded-[40px] border border-outline-variant/20 shadow-xl shadow-primary/5">
          <div className="w-20 h-20 rounded-[32px] bg-primary/5 mx-auto mb-8 flex items-center justify-center text-primary group transition-transform hover:scale-105 duration-500">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">AI Advisory Engine</h2>
          <p className="text-base text-on-surface-variant mb-10 leading-relaxed max-w-sm mx-auto">Generate a high-level strategic review of your development feasibility based on current Victorian regulatory and market benchmarks.</p>
          <button 
            className="py-5 px-12 rounded-2xl bg-primary text-white text-base font-bold cursor-pointer hover:bg-primary/90 active:scale-[0.98] transition-all shadow-2xl shadow-primary/30" 
            onClick={runAI}
          >
            Execute Strategic Analysis
          </button>
        </div>
      )}

      {!aiLoad && aiText && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white rounded-[40px] border border-outline-variant/10 p-6 md:p-10 shadow-2xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10 pb-6 border-b border-outline-variant/10 gap-4">
              <div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Automated Report</div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Feasibility Insights</h3>
              </div>
              <div className="sm:text-right">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] mb-2">Status</div>
                <div className={`text-xs font-bold py-1 px-3 rounded-full border inline-block ${isGo ? "bg-primary/5 border-primary/20 text-primary" : "bg-secondary/5 border-secondary/20 text-secondary"}`}>
                  {isGo ? "Optimized" : "Sub-optimal"}
                </div>
              </div>
            </div>
            
            <div className="max-w-none">
              {renderAI()}
            </div>
            
            <div className="mt-12 pt-8 border-t border-dashed border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center bg-surface-container-low/30 -mx-6 md:-mx-10 -mb-6 md:-mb-10 px-6 md:px-10 py-6 gap-4">
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest italic text-center sm:text-left">Generated by Athen AI Lab</span>
              <button 
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                onClick={runAI}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Refresh Data
              </button>
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[32px] border border-outline-variant/20 p-7 shadow-sm">
              <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Key Variable: Margin</div>
              <div className={`text-3xl font-black leading-none tracking-tighter ${isGo ? "text-primary" : isBord ? "text-secondary" : "text-foreground"}`}>{pct(res.margin)}</div>
            </div>
            <div className="bg-white rounded-[32px] border border-outline-variant/20 p-7 shadow-sm">
              <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Key Variable: Profit</div>
              <div className={`text-3xl font-black leading-none tracking-tighter ${res.profit >= 0 ? "text-primary" : "text-secondary"}`}>{$(res.profit)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );


  return (
    <div className="bg-background min-h-screen flex flex-col md:grid md:grid-cols-[260px_1fr] md:overflow-hidden font-sans">
      
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex flex-col bg-foreground">
        <div className="p-8 border-b border-background/10">
          <Link href="/" className="text-xl font-bold text-background tracking-tighter">athen.studio</Link>
          <div className="text-[10px] text-background/40 font-bold uppercase tracking-widest mt-2">Feasibility Lab</div>
        </div>
        <div className="py-6 flex-1 overflow-y-auto px-4 space-y-2">
          <div className="px-4 py-2 text-[10px] font-bold text-background/30 uppercase tracking-widest">Navigation</div>
          {NAV_TABS.map(t => (
            <button key={t} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-bold transition-all w-full text-left ${tab === t ? "text-white bg-primary shadow-lg shadow-primary/20" : "text-background/50 hover:text-white hover:bg-background/5"}`} onClick={() => setTab(t)}>
              <div className={`w-1.5 h-1.5 rounded-full ${tab === t ? "bg-white" : "bg-background/20"}`} />
              {t === "ai" ? "AI Advisory" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <div className="px-4 py-2 text-[10px] font-bold text-background/30 uppercase tracking-widest mt-6">Development Type</div>
          {DEV_NAV.map(t => (
            <button key={t} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all w-full text-left ${inp.devType === t ? "text-white bg-background/10" : "text-background/40 hover:text-white hover:bg-background/5"}`} onClick={() => set("devType", t)}>
              <div className={`w-1 h-1 rounded-full ${inp.devType === t ? "bg-secondary" : "bg-background/10"}`} />
              {t}
            </button>
          ))}
        </div>
        <div className={`p-6 m-4 rounded-3xl transition-all ${
          isGo ? "bg-primary" : isBord ? "bg-secondary" : "bg-background/10"
        }`}>
          <div className="text-[10px] font-extrabold tracking-widest uppercase mb-1 text-white/50">Project Health</div>
          <div className="text-2xl font-extrabold leading-none text-white tracking-tighter">{vLabel}</div>
          <div className="text-[11px] text-white/70 font-bold mt-2">{pct(res.margin)} Margin</div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-foreground p-5 space-y-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-background tracking-tighter">athen.studio</Link>
          <div className={`rounded-xl py-1.5 px-4 text-right ${
            isGo ? "bg-primary text-white" : isBord ? "bg-secondary text-white" : "bg-background/10 text-white"
          }`}>
            <div className="text-[9px] font-bold tracking-widest uppercase opacity-60">Verdict</div>
            <div className="text-sm font-extrabold leading-tight">{vLabel} · {pct(res.margin)}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {NAV_TABS.map(t => (
            <button key={t} className={`flex-1 py-3 px-1 rounded-xl text-xs font-bold transition-all ${tab === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-background/5 text-background/50"}`} onClick={() => setTab(t)}>
              {t === "ai" ? "AI Advisory" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DEV_NAV.map(t => (
            <button key={t} className={`text-[11px] font-bold py-2 px-4 rounded-xl border whitespace-nowrap transition-all ${inp.devType === t ? "bg-white text-foreground border-white" : "bg-transparent text-background/40 border-background/10"}`} onClick={() => set("devType", t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col bg-background overflow-y-auto relative no-scrollbar">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-surface-container-low/20 border-b border-outline-variant/10 md:sticky md:top-0 md:left-0 md:right-0 md:z-10 backdrop-blur-md flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Market</span>
            <select 
              value={inp.state} 
              onChange={e => set("state", e.target.value)}
              className="text-[11px] font-bold px-3 py-1 border border-outline-variant/30 rounded-lg bg-background text-foreground outline-none cursor-pointer focus:border-primary transition-all"
            >
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="text-outline-variant/30 hidden sm:inline">|</span>
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Entry</span>
            <span className="text-xs font-extrabold text-foreground tabular-nums">{$(inp.purchasePrice)}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Total Cost</span>
              <span className="text-xs font-extrabold text-foreground tracking-tight tabular-nums">{$(res.total)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Net Profit</span>
              <span className={`text-xs font-extrabold tracking-tight tabular-nums ${res.profit >= 0 ? "text-primary" : "text-secondary"}`}>{$(res.profit)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-1 max-w-4xl w-full">
          {tab === "inputs" && InputsPane}
          {tab === "results" && ResultsPane}
          {tab === "ai" && AIPane}
        </div>
      </div>

    </div>
  );
}
