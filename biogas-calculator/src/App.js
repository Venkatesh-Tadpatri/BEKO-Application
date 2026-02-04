// --------------------------------------updated with different fields for suction and discharge-------------------


// import React, { useState } from "react";
// import bgGasFilter from "./assets/bg-gas-filter.png";

// /* ===========================
//    CONFIGURATION (JSON ONLY)
//    =========================== */

// const CONFIG = {
//   gases: {
//     "Passivation Air": { gasFactor: 1, mwra: 2 },
//     "Hydrogen (Dry)": { gasFactor: 3.79, mwra: 5 },
//     "Hydrogen (Saturated)": { gasFactor: 3.79, mwra: 7 },
//     Helium: { gasFactor: 2.69, mwra: 10 },
//     "Biogas/Methane/CNG": { gasFactor: 1.34, mwra: 1.5 },
//     N2: { gasFactor: 1.01, mwra: 1 },
//     CO2: { gasFactor: 0.81, mwra: 1 },
//     O2: { gasFactor: 0.95, mwra: 1 },
//     "Compressed Air/Argon": { gasFactor: 1, mwra: 1 }
//   },

//   pressureFactors: [
//     { type: "Flanged", max: 50, divisor: 7 },
//     { type: "Discharge", min: 0, max: 100, divisor: 100 },
//     { type: "Discharge", min: 100, max: 350, divisor: 350 },
//     { type: "Discharge", min: 350, max: 500, divisor: 500 }
//   ],

//   temperature: { base: 20 },

//   suctionModels: [
//     { model: "L085", flow: 950 },
//     { model: "L080", flow: 1420 },
//     { model: "L100", flow: 2840 },
//     { model: "L102", flow: 4260 },
//     { model: "L150", flow: 5680 },
//     { model: "L156", flow: 9940 },
//     { model: "L200", flow: 11360 },
//     { model: "L204", flow: 14200 },
//     { model: "L254", flow: 19880 },
//     { model: "L304", flow: 31240 }
//   ],

//   dischargeModels: [
//     { model: "HP100S045", flow: 100, pressure: 100 },
//     { model: "HP100S050", flow: 200, pressure: 100 },
//     { model: "HP100S055", flow: 460, pressure: 100 },
//     { model: "HP100S075", flow: 680, pressure: 100 },
//     { model: "HP100M010", flow: 1200, pressure: 100 },
//     { model: "HP100M015", flow: 1700, pressure: 100 },
//     { model: "HP100M020", flow: 3400, pressure: 100 },

//     { model: "HP350S040", flow: 232, pressure: 350 },
//     { model: "HP350S045", flow: 255, pressure: 350 },
//     { model: "HP350S050", flow: 510, pressure: 350 },
//     { model: "HP350S075", flow: 750, pressure: 350 },
//     { model: "HP350M010", flow: 1330, pressure: 350 },
//     { model: "HP350M012", flow: 2180, pressure: 350 },
//     { model: "HP350M015", flow: 4360, pressure: 350 },

//     { model: "HP500S040", flow: 121, pressure: 500 },
//     { model: "HP500S045", flow: 278, pressure: 500 },
//     { model: "HP500S050", flow: 556, pressure: 500 }
//   ],

//   exclusions: ["HP100S040", "HP350S030", "HP500S030"],

//   suffixes: {
//     filtration: { 25: "C", 5: "G", 1: "F", 0.01: "S", 0.003: "A" },
//     dp: "D",
//     drain: "M"
//   },

//   filterScopes: ["Simplex", "Duplex", "Both"],
//   endConnections: {
//     suction: ["Flanged", "Threaded"],
//     discharge: ["Flanged", "Threaded", "Welded"]
//   }
// };

// /* ===========================
//    UTILITIES
//    =========================== */

// const getPressureFactor = (type, minPressure) => {
//   const p = Number(minPressure);
//   let rule;

//   if (type === "Suction") {
//     rule = CONFIG.pressureFactors.find(r => r.type === "Flanged");
//   } else {
//     rule = CONFIG.pressureFactors.find(
//       r => r.type === "Discharge" && p > r.min && p <= r.max
//     );
//     if (!rule) {
//       rule = CONFIG.pressureFactors.find(r => r.type === "Discharge");
//     }
//   }

//   return Math.sqrt((p + 1) / (rule.divisor + 1));
// };

// const getTempFactor = (t) =>
//   Math.sqrt((273 + CONFIG.temperature.base) / (273 + Number(t)));

// const selectHousing = (models, flow) => {
//   const sorted = [...models].sort((a, b) => a.flow - b.flow);
//   let chosen = sorted.find(m => flow <= m.flow) || sorted.at(-1);

//   if (flow > chosen.flow * 1.05) {
//     const idx = sorted.indexOf(chosen);
//     if (idx > 0) chosen = sorted[idx - 1];
//   }
//   return chosen;
// };

// const getAppropriatePressureTier = (requiredPressure) => {
//   const p = Number(requiredPressure);
//   const tiers = [100, 350, 500];
  
//   for (let tier of tiers) {
//     if (p <= tier) {
//       return tier;
//     }
//   }
  
//   return tiers[tiers.length - 1];
// };

// /* ===========================
//    COMPONENT
//    =========================== */

// export default function FilterSizingCalculator() {
//   const DEFAULT_SUCTION_INPUT = {
//     filterType: "Suction",
//     filterScope: "Simplex",
//     gas: "Biogas/Methane/CNG",
//     flow: "",
//     minPressure: "",
//     maxPressure: "",
//     temperature: "",
//     endConnection: "Flanged",
//     moistureContent: "",
//     oilContent: "",
//     dustContent: "",
//     DuplexFiltration: 5,
//     DuplexOilResidual: ""
//   };

//   const DEFAULT_DISCHARGE_INPUT = {
//     filterType: "Discharge",
//     filterScope: "Simplex",
//     gas: "Biogas/Methane/CNG",
//     flow: "",
//     minPressure: "",
//     maxPressure: "",
//     temperature: "",
//     endConnection: "Flanged",
//     oilContent: "",
//     dustContent: "",
//     DuplexFiltration: 5,
//     DuplexOilResidual: "",
//     fittings: "",
//     drainType: "Manual Drain"
//   };

//   const [result, setResult] = useState(null);
//   const [input, setInput] = useState(DEFAULT_SUCTION_INPUT);

//   const calculate = () => {
//     // Validate required fields
//     if (!input.flow || !input.minPressure || !input.temperature) {
//       alert("Please fill all required fields (Flow Rate, Min Working Pressure, Simplex Temperature)");
//       return;
//     }

//     const gas = CONFIG.gases[input.gas];
//     const gasFactor = gas.gasFactor;
//     const mwra = gas.mwra;

//     const pf = getPressureFactor(input.filterType, input.minPressure);
//     const tf = getTempFactor(input.temperature);

//     const totalFactor = gasFactor * pf * tf;
//     const initialFlow = Number(input.flow) / totalFactor;
//     const finalFlow = initialFlow * mwra;

//     let models;
//     if (input.filterType === "Suction") {
//       models = CONFIG.suctionModels;
//     } else {
//       const targetPressure = getAppropriatePressureTier(input.minPressure);
//       models = CONFIG.dischargeModels.filter(
//         m => m.pressure === targetPressure && !CONFIG.exclusions.includes(m.model)
//       );
//     }

//     const housing = selectHousing(models, finalFlow);

//     setResult({
//       gasFactor,
//       mwra,
//       pf,
//       tf,
//       totalFactor,
//       initialFlow,
//       finalFlow,
//       housing:
//         housing.model +
//         CONFIG.suffixes.filtration[input.DuplexFiltration] +
//         CONFIG.suffixes.dp +
//         CONFIG.suffixes.drain,
//       moc: housing.model,
//       drainType: input.filterType === "Discharge" ? input.drainType : "Manual Drain"
//     });
//   };

//   const resetForm = () => {
//     if (input.filterType === "Suction") {
//       setInput(DEFAULT_SUCTION_INPUT);
//     } else {
//       setInput(DEFAULT_DISCHARGE_INPUT);
//     }
//     setResult(null);
//   };

//   const handleFilterTypeChange = (newType) => {
//     if (newType === "Suction") {
//       setInput(DEFAULT_SUCTION_INPUT);
//     } else {
//       setInput(DEFAULT_DISCHARGE_INPUT);
//     }
//     setResult(null);
//   };

//   return (
//     <div className="page">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         body, html {
//           overflow: hidden;
//           height: 100vh;
//         }

//         .page {
//           height: 100vh;
//           width: 100vw;
//           min-height: 100vh;
//           background:
//             linear-gradient(rgba(15, 23, 42, 0.20), rgba(30, 41, 59, 0.20)),
//             url(${bgGasFilter}) no-repeat center center / cover;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//           padding: 0;
//           position: relative;
//           overflow: hidden;
//         }

//         .container {
//           width: 95%;
//           max-width: 1100px;
//           max-height: 95vh;
//           position: relative;
//           z-index: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .card {
//           background: rgba(255, 255, 255, 0.98);
//           backdrop-filter: blur(20px);
//           border-radius: 18px;
//           box-shadow: 
//             0 20px 60px rgba(0, 0, 0, 0.3),
//             0 0 0 1px rgba(255, 255, 255, 0.1) inset;
//           overflow: hidden;
//           width: 100%;
//           max-height: 95vh;
//           display: flex;
//           flex-direction: column;
//         }

//         .card-header {
//           background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//           padding: 20px 28px;
//           color: white;
//           position: relative;
//           overflow: hidden;
//           flex-shrink: 0;
//         }

//         .card-header::before {
//           content: '';
//           position: absolute;
//           top: -50%;
//           right: -10%;
//           width: 350px;
//           height: 350px;
//           background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
//           border-radius: 50%;
//         }

//         .header-content {
//           position: relative;
//           z-index: 1;
//         }

//         .header-top {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .icon-wrapper {
//           width: 48px;
//           height: 48px;
//           background: rgba(255, 255, 255, 0.2);
//           backdrop-filter: blur(10px);
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 24px;
//           box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
//           flex-shrink: 0;
//         }

//         .header-top h1 {
//           font-size: 24px;
//           font-weight: 800;
//           letter-spacing: -0.5px;
//           text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           line-height: 1.2;
//         }

//         .header-subtitle {
//           font-size: 13px;
//           opacity: 0.95;
//           font-weight: 500;
//           margin-top: 6px;
//         }

//         .card-body {
//           padding: 24px 28px;
//           overflow-y: auto;
//           flex: 1;
//         }

//         .card-body::-webkit-scrollbar {
//           width: 8px;
//         }

//         .card-body::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }

//         .card-body::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }

//         .card-body::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }

//         .section-title {
//           font-size: 11px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//           color: #64748b;
//           margin-bottom: 16px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .section-title::before {
//           content: '';
//           width: 3px;
//           height: 12px;
//           background: linear-gradient(135deg, #3b82f6, #2563eb);
//           border-radius: 2px;
//         }

//         .grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 16px;
//           margin-bottom: 20px;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .form-label {
//           font-size: 12px;
//           font-weight: 600;
//           color: #1e293b;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .required {
//           color: #ef4444;
//           font-size: 10px;
//         }

//         .optional {
//           color: #64748b;
//           font-size: 10px;
//           font-weight: 500;
//         }

//         .input-wrapper {
//           position: relative;
//         }

//         input,
//         select {
//           width: 100%;
//           height: 40px;
//           padding: 0 12px;
//           border-radius: 8px;
//           border: 2px solid #e2e8f0;
//           font-size: 13px;
//           font-weight: 500;
//           color: #1e293b;
//           background-color: #ffffff;
//           transition: all 0.2s ease;
//           font-family: 'Inter', sans-serif;
//         }

//         input:focus,
//         select:focus {
//           outline: none;
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }

//         input::placeholder {
//           color: #94a3b8;
//           font-weight: 400;
//         }

//         .input-unit {
//           position: absolute;
//           right: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           font-size: 11px;
//           font-weight: 600;
//           color: #64748b;
//           pointer-events: none;
//         }

//         .button-group {
//           display: flex;
//           gap: 12px;
//           justify-content: center;
//           margin-top: 20px;
//         }

//         .btn {
//           padding: 11px 32px;
//           border-radius: 10px;
//           border: none;
//           font-size: 13px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-family: 'Inter', sans-serif;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }

//         .btn-primary {
//           background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//           color: white;
//         }

//         .btn-primary:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
//         }

//         .btn-primary:active {
//           transform: translateY(0);
//         }

//         .btn-secondary {
//           background: #f1f5f9;
//           color: #475569;
//         }

//         .btn-secondary:hover {
//           background: #e2e8f0;
//           transform: translateY(-2px);
//         }

//         .result-section {
//           margin-top: 24px;
//           animation: slideIn 0.4s ease-out;
//         }

//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .result-card {
//           background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//           border-radius: 14px;
//           padding: 20px;
//           border: 2px solid #e2e8f0;
//         }

//         .result-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 12px;
//           margin-bottom: 16px;
//         }

//         .result-item {
//           background: white;
//           padding: 12px;
//           border-radius: 8px;
//           border-left: 3px solid #3b82f6;
//           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
//         }

//         .result-label {
//           font-size: 10px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           color: #64748b;
//           margin-bottom: 4px;
//         }

//         .result-value {
//           font-size: 16px;
//           font-weight: 700;
//           color: #1e293b;
//         }

//         .final-result {
//           background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//           padding: 20px;
//           border-radius: 12px;
//           box-shadow: 
//             0 10px 28px rgba(59, 130, 246, 0.3),
//             0 0 0 1px rgba(255, 255, 255, 0.1) inset;
//           position: relative;
//           overflow: hidden;
//         }

//         .final-result::before {
//           content: '';
//           position: absolute;
//           top: -50%;
//           left: -50%;
//           width: 200%;
//           height: 200%;
//           background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
//           animation: rotate 20s linear infinite;
//         }

//         @keyframes rotate {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .final-result-content {
//           position: relative;
//           z-index: 1;
//         }

//         .final-result-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 16px;
//         }

//         .final-result-item {
//           text-align: center;
//         }

//         .final-label {
//           font-size: 11px;
//           font-weight: 600;
//           color: rgba(255, 255, 255, 0.9);
//           text-transform: uppercase;
//           letter-spacing: 1px;
//           margin-bottom: 8px;
//         }

//         .final-value {
//           font-size: 24px;
//           font-weight: 800;
//           color: white;
//           text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//           letter-spacing: 1px;
//         }

//         @media (max-width: 1024px) {
//           .grid {
//             grid-template-columns: repeat(2, 1fr);
//           }

//           .result-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }

//         @media (max-width: 768px) {
//           .container {
//             width: 98%;
//             max-height: 98vh;
//           }

//           .card {
//             max-height: 98vh;
//           }

//           .card-header {
//             padding: 16px 20px;
//           }

//           .header-top h1 {
//             font-size: 20px;
//           }

//           .header-subtitle {
//             font-size: 12px;
//           }

//           .icon-wrapper {
//             width: 42px;
//             height: 42px;
//             font-size: 20px;
//           }

//           .card-body {
//             padding: 20px;
//           }

//           .grid {
//             grid-template-columns: 1fr;
//             gap: 14px;
//           }

//           .button-group {
//             flex-direction: column;
//             gap: 10px;
//           }

//           .btn {
//             width: 100%;
//             justify-content: center;
//           }

//           .result-grid {
//             grid-template-columns: 1fr;
//             gap: 10px;
//           }

//           .final-result-grid {
//             grid-template-columns: 1fr;
//             gap: 12px;
//           }

//           .final-value {
//             font-size: 20px;
//           }
//         }
          
//         input[type="number"]::-webkit-inner-spin-button,
//         input[type="number"]::-webkit-outer-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }

//         input[type="number"] {
//           -moz-appearance: textfield;
//         }
//       `}</style>

//       <div className="container">
//         <div className="card">
//           <div className="card-header">
//             <div className="header-content">
//               <div className="header-top">
//                 <div className="icon-wrapper">♻️</div>
//                 <div>
//                   <h1>Filter Housing Selection</h1>
//                   <p className="header-subtitle">
//                     Advanced biogas filter sizing calculator
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="card-body">
//             <div className="section-title">Configuration Parameters</div>

//             <div className="grid">
//               {/* Filter Type */}
//               <div className="form-group">
//                 <label className="form-label">Type of Filter</label>
//                 <select 
//                   value={input.filterType} 
//                   onChange={e => handleFilterTypeChange(e.target.value)}
//                 >
//                   <option>Suction</option>
//                   <option>Discharge</option>
//                 </select>
//               </div>

//               {/* Filter Scope */}
//               <div className="form-group">
//                 <label className="form-label">Filter Scope</label>
//                 <select 
//                   value={input.filterScope} 
//                   onChange={e => setInput({ ...input, filterScope: e.target.value })}
//                 >
//                   {CONFIG.filterScopes.map(scope => (
//                     <option key={scope}>{scope}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Gas Type */}
//               <div className="form-group">
//                 <label className="form-label">Type of Gas</label>
//                 <select 
//                   value={input.gas} 
//                   onChange={e => setInput({ ...input, gas: e.target.value })}
//                 >
//                   {Object.keys(CONFIG.gases).map(g => (
//                     <option key={g}>{g}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Flow Rate */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Flow (m³/hr) <span className="required">*</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.flow}
//                     onChange={e => setInput({ ...input, flow: e.target.value })}
//                     placeholder="Enter flow rate"
//                   />
//                   <span className="input-unit">m³/hr</span>
//                 </div>
//               </div>

//               {/* Min Working Pressure */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Min. Working Pressure (barg) <span className="required">*</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.minPressure}
//                     onChange={e => setInput({ ...input, minPressure: e.target.value })}
//                     placeholder="Enter min pressure"
//                   />
//                   <span className="input-unit">barg</span>
//                 </div>
//               </div>

//               {/* Max Pressure */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Max. Pressure (barg)
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.maxPressure}
//                     onChange={e => setInput({ ...input, maxPressure: e.target.value })}
//                     placeholder="Enter max pressure"
//                   />
//                   <span className="input-unit">barg</span>
//                 </div>
//               </div>

//               {/* Simplex Temperature */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Simplex Air Temperature (Deg.C) <span className="required">*</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.temperature}
//                     onChange={e => setInput({ ...input, temperature: e.target.value })}
//                     placeholder="Enter temperature"
//                   />
//                   <span className="input-unit">°C</span>
//                 </div>
//               </div>

//               {/* End Connection */}
//               <div className="form-group">
//                 <label className="form-label">
//                   End Connection (DN) {input.filterType === "Discharge" && <span className="optional">(Option for display)</span>}
//                 </label>
//                 <select 
//                   value={input.endConnection} 
//                   onChange={e => setInput({ ...input, endConnection: e.target.value })}
//                 >
//                   {CONFIG.endConnections[input.filterType.toLowerCase()].map(conn => (
//                     <option key={conn}>{conn}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Moisture Content - Suction Only */}
//               {input.filterType === "Suction" && (
//                 <div className="form-group">
//                   <label className="form-label">Simplex Moisture Content</label>
//                   <input
//                     type="text"
//                     value={input.moistureContent}
//                     onChange={e => setInput({ ...input, moistureContent: e.target.value })}
//                     placeholder="Enter moisture content"
//                   />
//                 </div>
//               )}

//               {/* Oil Content */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Simplex Oil Content {input.filterType === "Suction" ? "(mg/m3)" : "(ppm)"} <span className="optional">(optional)</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.oilContent}
//                     onChange={e => setInput({ ...input, oilContent: e.target.value })}
//                     placeholder="Enter oil content"
//                   />
//                   <span className="input-unit">{input.filterType === "Suction" ? "mg/m³" : "ppm"}</span>
//                 </div>
//               </div>

//               {/* Dust Content */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Simplex Dust Content (micron) <span className="optional">(optional)</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.dustContent}
//                     onChange={e => setInput({ ...input, dustContent: e.target.value })}
//                     placeholder="Enter dust content"
//                   />
//                   <span className="input-unit">micron</span>
//                 </div>
//               </div>

//               {/* Duplex Filtration */}
//               <div className="form-group">
//                 <label className="form-label">Duplex Filtration (micron)</label>
//                 <select 
//                   value={input.DuplexFiltration} 
//                   onChange={e => setInput({ ...input, DuplexFiltration: Number(e.target.value) })}
//                 >
//                   <option value={25}>25 micron</option>
//                   <option value={5}>5 micron</option>
//                   <option value={1}>1 micron</option>
//                   <option value={0.01}>0.01 micron</option>
//                   <option value={0.003}>0.003 micron</option>
//                 </select>
//               </div>

//               {/* Duplex Oil Residual */}
//               <div className="form-group">
//                 <label className="form-label">Duplex Oil Residual (mg/m3)</label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.DuplexOilResidual}
//                     onChange={e => setInput({ ...input, DuplexOilResidual: e.target.value })}
//                     placeholder="Enter oil residual"
//                   />
//                   <span className="input-unit">mg/m³</span>
//                 </div>
//               </div>

//               {/* Discharge Filter Specific Fields */}
//               {input.filterType === "Discharge" && (
//                 <>
//                   {/* Fittings */}
//                   <div className="form-group">
//                     <label className="form-label">Fittings <span className="optional">(for output)</span></label>
//                     <input
//                       type="text"
//                       value={input.fittings}
//                       onChange={e => setInput({ ...input, fittings: e.target.value })}
//                       placeholder="Enter fittings"
//                     />
//                   </div>

//                   {/* Drain Type */}
//                   <div className="form-group">
//                     <label className="form-label">Type of Drain <span className="optional">(Display)</span></label>
//                     <select 
//                       value={input.drainType} 
//                       onChange={e => setInput({ ...input, drainType: e.target.value })}
//                     >
//                       <option>Manual Drain</option>
//                       <option>Auto Drain</option>
//                     </select>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="button-group">
//               <button className="btn btn-primary" onClick={calculate}>
//                 <span>🔍</span> Calculate Selection
//               </button>
//               <button className="btn btn-secondary" onClick={resetForm}>
//                 <span>↻</span> Reset Form
//               </button>
//             </div>

//             {result && (
//               <div className="result-section">
//                 <div className="section-title">Calculation Results</div>
                
//                 <div className="result-card">
//                   <div className="result-grid">
//                     <div className="result-item">
//                       <div className="result-label">Gas Factor</div>
//                       <div className="result-value">{result.gasFactor}</div>
//                     </div>

//                     <div className="result-item">
//                       <div className="result-label">MWrA Factor</div>
//                       <div className="result-value">{result.mwra}</div>
//                     </div>

//                     <div className="result-item">
//                       <div className="result-label">Pressure Factor</div>
//                       <div className="result-value">{result.pf.toFixed(3)}</div>
//                     </div>

//                     <div className="result-item">
//                       <div className="result-label">Temperature Factor</div>
//                       <div className="result-value">{result.tf.toFixed(3)}</div>
//                     </div>

//                     <div className="result-item">
//                       <div className="result-label">Total Factor</div>
//                       <div className="result-value">{result.totalFactor.toFixed(3)}</div>
//                     </div>

//                     <div className="result-item">
//                       <div className="result-label">Initial Flow</div>
//                       <div className="result-value">{result.initialFlow.toFixed(2)} m³/hr</div>
//                     </div>

//                     <div className="result-item">
//                       <div className="result-label">Final Flow</div>
//                       <div className="result-value">{result.finalFlow.toFixed(2)} m³/hr</div>
//                     </div>
//                   </div>

//                   <div className="final-result">
//                     <div className="final-result-content">
//                       <div className="final-result-grid">
//                         <div className="final-result-item">
//                           <div className="final-label">Selected Housing Model</div>
//                           <div className="final-value">{result.housing}</div>
//                         </div>
//                         {/* <div className="final-result-item">
//                           <div className="final-label">MOC of Housing</div>
//                           <div className="final-value">{result.moc}</div>
//                         </div> */}
//                         {input.filterType === "Discharge" && (
//                           <div className="final-result-item">
//                             <div className="final-label">Type of Drain</div>
//                             <div className="final-value">{result.drainType}</div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// -------------------------------------------------------------------------------------------------------
import React from 'react';
import FilterSizingCalculator from './FilterSizingCalculator';

function App() {
  return (
    <FilterSizingCalculator />
  );
}

export default App;