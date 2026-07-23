// import React, { useState } from "react";
// import CONFIG from "./filterConfig.json";
// import {
//   getPressureFactor,
//   getTempFactor,
//   selectHousing,
//   getAppropriatePressureTier
// } from "./filterUtils";
// import { generatePDF } from "./pdfGenerator";
// import bgGasFilter from "./assets/bg-gas-filter.png";
// import bekoLogo from "./assets/Beko-logo.png";
// import "./FilterSizingCalculator.css";

// /* ===========================
//    PASSWORD CONFIG
//    =========================== */
// const APP_PASSWORD = "Beko@123"; // change before delivery

// export default function FilterSizingCalculator() {
//   /* ===========================
//      AUTHENTICATION STATE
//      =========================== */
//   const [authenticated, setAuthenticated] = useState(false);
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   /* ===========================
//      FORM STATE
//      =========================== */
//   const DEFAULT_SUCTION_INPUT = {
//     customerName: "",
//     filterType: "",
//     filterTypeOption: "",
//     filterScope: "",
//     gas: "",
//     flow: "",
//     minPressure: "",
//     maxPressure: "",
//     temperature: "",
//     endConnection: "",
//     moistureContent: "",
//     oilContent: "",
//     dustContent: "",
//     DuplexFiltration: "",
//     DuplexOilResidual: "",
//     moc: ""
//   };

//   const DEFAULT_DISCHARGE_INPUT = {
//     customerName: "",
//     filterType: "",
//     filterTypeOption: "",
//     filterScope: "",
//     gas: "",
//     flow: "",
//     minPressure: "",
//     maxPressure: "",
//     temperature: "",
//     endConnection: "",
//     oilContent: "",
//     dustContent: "",
//     DuplexFiltration: "",
//     DuplexOilResidual: "",
//     fittings: "",
//     drainType: "",
//     moc: ""
//   };

//   const [result, setResult] = useState(null);
//   const [input, setInput] = useState({
//     customerName: "",
//     filterType: "",
//     filterTypeOption: "",
//     filterScope: "",
//     gas: "",
//     flow: "",
//     minPressure: "",
//     maxPressure: "",
//     temperature: "",
//     endConnection: "",
//     moistureContent: "",
//     oilContent: "",
//     dustContent: "",
//     DuplexFiltration: "",
//     DuplexOilResidual: "",
//     fittings: "",
//     drainType: "",
//     moc: ""
//   });
//   const [showCalculations, setShowCalculations] = useState(false);
//   const [errorModal, setErrorModal] = useState({ show: false, message: "" });

//   /* ===========================
//      AUTHENTICATION HANDLER
//      =========================== */
//   const handleLogin = () => {
//     if (password === APP_PASSWORD) {
//       setAuthenticated(true);
//       setError("");
//     } else {
//       setError("Invalid password. Please try again.");
//     }
//   };

//   /* ===========================
//      HELPER FUNCTION TO SHOW ERROR MODAL
//      =========================== */
//   const showError = (message) => {
//     setErrorModal({ show: true, message });
//   };

//   const closeErrorModal = () => {
//     setErrorModal({ show: false, message: "" });
//   };

//   /* ===========================
//      CALCULATION FUNCTIONS
//      =========================== */
//   const calculate = () => {
//     // Validate required fields only
//     if (!input.filterType) {
//       showError("Please select Type of Filter");
//       return;
//     }
//     if (!input.gas) {
//       showError("Please select Type of Gas");
//       return;
//     }
//     if (!input.flow) {
//       showError("Please enter Flow Rate");
//       return;
//     }
//     if (!input.minPressure) {
//       showError("Please enter Min. Working Pressure");
//       return;
//     }
    
//     // Validate pressure ranges based on filter type
//     const minPressure = Number(input.minPressure);
//     const maxPressure = Number(input.maxPressure);
    
//     if (input.filterType === "Suction") {
//       if (minPressure < 1 || minPressure > 100) {
//         showError("For Suction filters, Min. Working Pressure must be between 1 and 100 barg");
//         return;
//       }
//       if (input.maxPressure && (maxPressure < 1 || maxPressure > 100)) {
//         showError("For Suction filters, Max. Pressure must be between 1 and 100 barg");
//         return;
//       }
//     } else if (input.filterType === "Discharge") {
//       if (minPressure < 1 || minPressure > 500) {
//         showError("For Discharge filters, Min. Working Pressure must be between 1 and 500 barg");
//         return;
//       }
//       if (input.maxPressure && (maxPressure < 1 || maxPressure > 500)) {
//         showError("For Discharge filters, Max. Pressure must be between 1 and 500 barg");
//         return;
//       }
//     }
    
//     if (!input.temperature) {
//       showError("Please enter Inlet Air Temperature");
//       return;
//     }
//     if (!input.DuplexFiltration) {
//       showError("Please select Outlet Filtration (micron)");
//       return;
//     }

//     const gas = CONFIG.gases[input.gas];
//     const gasFactor = gas.gasFactor;
//     const mwra = gas.mwra;

//     const pf = getPressureFactor(input.filterType, input.minPressure, CONFIG.pressureFactors);
//     const tf = getTempFactor(input.temperature, CONFIG.temperature.base);

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

//     // Check if selected housing requires 'W' instead of 'D' for special models
//     const specialModels = ["HP100S040", "HP350S030", "HP500S030"];
//     const isSpecialModel = specialModels.includes(housing.model);
//     const dpSuffix = isSpecialModel ? "M" : CONFIG.suffixes.dp;
//     const stageDSuffix = isSpecialModel ? "W" : "D"; // 'W' for special models, 'D' for regular

//     let housingModel = "";

//     // DISCHARGE FILTER LOGIC - Multi-stage based on oil content
//     if (input.filterType === "Discharge") {
//       const oilContent = Number(input.oilContent) || 0;
//       const temperature = Number(input.temperature);
//       const baseHousing = housing.model; // e.g., HP100M015

//       if (oilContent === 0 || !input.oilContent) {
//         // No oil content provided - Single stage with standard outlet micron
//         housingModel = baseHousing + CONFIG.suffixes.filtration[input.DuplexFiltration] + 
//                        dpSuffix + CONFIG.suffixes.drain;
//       } else if (oilContent <= 50) {
//         // Low oil content (≤ 50 ppm) - Single stage FDM or FWM
//         housingModel = `${baseHousing}F${stageDSuffix}M`;
//       } else if (oilContent > 50 && oilContent < 100) {
//         // Medium oil content (>50 to <100 ppm) - Two stages: FDM/FWM + SDM/SWM
//         housingModel = `${baseHousing}F${stageDSuffix}M + S${stageDSuffix}M`;
//       } else if (oilContent >= 100 && oilContent <= 200) {
//         // High oil content (100-200 ppm) - Three stages: FDM/FWM + SDM/SWM + (SDM/SWM or AWM)
//         // Final stage depends on gas type: Helium uses SDM/SWM, others use AWM
//         const finalStage = input.gas === "Helium" ? `S${stageDSuffix}M` : "AWM";
//         housingModel = `${baseHousing}F${stageDSuffix}M + S${stageDSuffix}M + ${finalStage}`;
//       } else {
//         // Oil content > 200 ppm - Show error or use maximum configuration
//         showError("Oil content exceeds 200 ppm. Please contact technical support for custom configuration.");
//         return;
//       }

//       // Apply Duplex logic for discharge filters if selected
//       if (input.filterScope === "Duplex") {
//         housingModel = `${housingModel} + ${housingModel}`;
//       }

//     } else {
//       // SUCTION FILTER LOGIC (existing logic)
//       housingModel =
//         housing.model +
//         CONFIG.suffixes.filtration[input.DuplexFiltration] +
//         CONFIG.suffixes.dp +
//         CONFIG.suffixes.drain;

//       // Add /spl suffix for Suction filters when MOC is selected
//       if (input.moc) {
//         housingModel += "/spl";
//       }

//       // If Duplex is selected, double the housing model
//       if (input.filterScope === "Duplex") {
//         housingModel = `${housingModel} + ${housingModel}`;
//       }
//     }

//     setResult({
//       gasFactor,
//       mwra,
//       pf,
//       tf,
//       totalFactor,
//       initialFlow,
//       finalFlow,
//       housing: housingModel,
//       moc: input.moc,
//       drainType: input.filterType === "Discharge" ? input.drainType : "Manual Drain",
//       fittings: input.filterType === "Discharge" ? input.fittings : null
//     });
    
//     // Reset calculations view when new calculation is done
//     setShowCalculations(false);
//   };

//   const resetForm = () => {
//     setInput({
//       customerName: "",
//       filterType: "",
//       filterTypeOption: "",
//       filterScope: "",
//       gas: "",
//       flow: "",
//       minPressure: "",
//       maxPressure: "",
//       temperature: "",
//       endConnection: "",
//       moistureContent: "",
//       oilContent: "",
//       dustContent: "",
//       DuplexFiltration: "",
//       DuplexOilResidual: "",
//       fittings: "",
//       drainType: "",
//       moc: ""
//     });
//     setResult(null);
//     setShowCalculations(false);
//   };

//   const handleFilterTypeChange = (newType) => {
//     setInput({ ...input, filterType: newType, filterTypeOption: "", filterScope: "" });
//     setResult(null);
//     setShowCalculations(false);
//   };

//   const handlePrintPDF = () => {
//     if (!result) {
//       showError("Please calculate the selection first before generating PDF");
//       return;
//     }
//     generatePDF(input, result);
//   };

//   /* ===========================
//      HELPER: Get max pressure limit based on filter type
//      =========================== */
//   const getMaxPressureLimit = () => {
//     if (input.filterType === "Suction") return 100;
//     if (input.filterType === "Discharge") return 500;
//     return 500; // default
//   };

//   /* ===========================
//      HELPER: Get filter scope options based on filter type
//      =========================== */
//   const getFilterScopeOptions = () => {
//     if (input.filterType === "Suction") {
//       return ["Simplex", "Duplex"];
//     } else if (input.filterType === "Discharge") {
//       return ["Discharge filter"];
//     }
//     return []; // default when no filter type selected
//   };

//   /* ===========================
//      HELPER: Get filter type options based on Type of Filter
//      =========================== */
//   const getFilterTypeOptions = () => {
//     if (input.filterType === "Suction") {
//       return ["Flanged"];
//     } else if (input.filterType === "Discharge") {
//       return ["High Pressure Discharge Pressure"];
//     }
//     return []; 
//   };

//   /* ===========================
//      HELPER: Prevent invalid characters in number inputs
//      =========================== */
//   const handleNumberKeyPress = (e) => {
//     // Prevent: e, E, +, -, .
//     if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
//       e.preventDefault();
//     }
//   };

//   /* ===========================
//      PASSWORD SCREEN
//      =========================== */
  
//   if (!authenticated) {
//     return (
//       <div
//         className="auth-container"
//         style={{
//           backgroundImage: `
//             linear-gradient(
//               rgba(15, 23, 42, 0.55),
//               rgba(15, 23, 42, 0.55)
//             ),
//             url(${bgGasFilter})
//           `,
//         }}
//       >
//         <div className="auth-card">
//           <div className="auth-icon">🔒</div>

//           <h2 className="auth-title">Authentication Required</h2>

//           <p className="auth-subtitle">
//             Enter your password to access the application
//           </p>

//           <input
//             type="password"
//             className="auth-input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//             placeholder="Enter your password"
//           />

//           {error && (
//             <p className="auth-error">{error}</p>
//           )}

//           <button onClick={handleLogin} className="auth-button">
//             Unlock Application
//           </button>

//           <div className="auth-footer-note">
//             🔐 For security: Password is encrypted and the application will
//             close after multiple failed attempts.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ===========================
//      MAIN APPLICATION
//      =========================== */

//   return (
//     <div className="page">
//       {/* ERROR MODAL */}
//       {errorModal.show && (
//         <div className="modal-overlay" onClick={closeErrorModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3 className="modal-title">⚠️ Validation Error</h3>
//             </div>
//             <div className="modal-body">
//               <p>{errorModal.message}</p>
//             </div>
//             <div className="modal-footer">
//               <button className="modal-button" onClick={closeErrorModal}>
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container">
//         <div className="card">
//           <div className="card-header">
//             <div className="header-content">
//               <div className="header-top">
//                 <div className="header-left">
//                   <div className="icon-wrapper">♻️</div>
//                   <div>
//                     <h1>Beko Filter Selection Tool</h1>
//                     <p className="header-subtitle">
//                       Beko Advanced Filter Sizing Tool
//                     </p>
//                   </div>
//                 </div>
//                 <div className="header-right">
//                   <img src={bekoLogo} alt="Beko Logo" className="beko-logo" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="card-body">
//             <div className="section-title">Configuration Parameters</div>

//             <div className="grid">
//               {/* Customer Name */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Customer Name <span className="optional">(optional)</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={input.customerName}
//                   onChange={e => setInput({ ...input, customerName: e.target.value })}
//                   placeholder="Enter customer name"
//                 />
//               </div>

//               {/* Filter Type */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Filter Selection <span className="required">*</span>
//                 </label>
//                 <select 
//                   value={input.filterType} 
//                   onChange={e => handleFilterTypeChange(e.target.value)}
//                 >
//                   <option value="">-- Select Filter Type --</option>
//                   <option>Suction</option>
//                   <option>Discharge</option>
//                 </select>
//               </div>

//               {/* Filter Type Option */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Filter Type <span className="optional">(optional)</span>
//                 </label>
//                 <select 
//                   value={input.filterTypeOption} 
//                   onChange={e => setInput({ ...input, filterTypeOption: e.target.value })}
//                   disabled={!input.filterType}
//                 >
//                   <option value="">-- Select Filter Type --</option>
//                   {getFilterTypeOptions().map(option => (
//                     <option key={option}>{option}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filter Scope */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Filter Scope <span className="optional">(optional)</span>
//                 </label>
//                 <select 
//                   value={input.filterScope} 
//                   onChange={e => setInput({ ...input, filterScope: e.target.value })}
//                   disabled={!input.filterType}
//                 >
//                   <option value="">-- Select Filter Scope --</option>
//                   {getFilterScopeOptions().map(scope => (
//                     <option key={scope}>{scope}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Gas Type */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Type of Gas <span className="required">*</span>
//                 </label>
//                 <select 
//                   value={input.gas} 
//                   onChange={e => setInput({ ...input, gas: e.target.value })}
//                 >
//                   <option value="">-- Select Gas Type --</option>
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
//                     onKeyPress={handleNumberKeyPress}
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
//                     min="1"
//                     max={getMaxPressureLimit()}
//                     value={input.minPressure}
//                     onChange={e => {
//                       const value = e.target.value;
//                       if (value === "") {
//                         setInput({ ...input, minPressure: "" });
//                         return;
//                       }
//                       const num = Number(value);
//                       const maxLimit = getMaxPressureLimit();
//                       if (num >= 1 && num <= maxLimit) {
//                         setInput({ ...input, minPressure: value });
//                       }
//                     }}
//                     onKeyPress={handleNumberKeyPress}
//                     placeholder="Enter min pressure"
//                   />
//                   <span className="input-unit">barg</span>
//                 </div>
//               </div>

//               {/* Max Pressure */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Max. Pressure (barg) <span className="optional">(optional)</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     min="1"
//                     max={getMaxPressureLimit()}
//                     value={input.maxPressure}
//                     onChange={e => {
//                       const value = e.target.value;
//                       if (value === "") {
//                         setInput({ ...input, maxPressure: "" });
//                         return;
//                       }
//                       const num = Number(value);
//                       const maxLimit = getMaxPressureLimit();
//                       if (num >= 1 && num <= maxLimit) {
//                         setInput({ ...input, maxPressure: value });
//                       }
//                     }}
//                     onKeyPress={handleNumberKeyPress}
//                     placeholder="Enter max pressure"
//                   />
//                   <span className="input-unit">barg</span>
//                 </div>
//               </div>

//               {/* Inlet Air Temperature */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Inlet Air Temperature (Deg.C) <span className="required">*</span>
//                 </label>

//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     min="1"
//                     max="100"
//                     value={input.temperature}
//                     placeholder="Enter temperature"
//                     onChange={e => {
//                       const value = e.target.value;

//                       // allow empty for editing
//                       if (value === "") {
//                         setInput({ ...input, temperature: "" });
//                         return;
//                       }

//                       const num = Number(value);

//                       if (num >= 1 && num <= 100) {
//                         setInput({ ...input, temperature: value });
//                       }
//                     }}
//                     onKeyPress={handleNumberKeyPress}
//                   />
//                   <span className="input-unit">°C</span>
//                 </div>
//               </div>


//               {/* End Connection */}
//               <div className="form-group">
//                 <label className="form-label">
//                   End Connection (DN) <span className="optional">(optional)</span>
//                 </label>
//                 <select 
//                   value={input.endConnection} 
//                   onChange={e => setInput({ ...input, endConnection: e.target.value })}
//                 >
//                   <option value="">-- Select Connection --</option>
//                   {CONFIG.endConnections.map(conn => (
//                     <option key={conn}>{conn}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* MOC of Housing */}
//               <div className="form-group">
//                 <label className="form-label">
//                   MOC of Housing <span className="optional">(optional)</span>
//                 </label>
//                 <select 
//                   value={input.moc} 
//                   onChange={e => setInput({ ...input, moc: e.target.value })}
//                 >
//                   <option value="">-- Select MOC --</option>
//                   {CONFIG.mocOptions.map(moc => (
//                     <option key={moc}>{moc}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Moisture Content - Suction Only */}
//               {input.filterType === "Suction" && (
//                 <div className="form-group">
//                   <label className="form-label">
//                     Simplex Moisture Content <span className="optional">(optional)</span>
//                   </label>
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
//                   Inlet Oil Content {input.filterType === "Suction" ? "(mg/m3)" : "(ppm)"} <span className="optional">(optional)</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.oilContent}
//                     onChange={e => setInput({ ...input, oilContent: e.target.value })}
//                     onKeyPress={handleNumberKeyPress}
//                     placeholder="Enter oil content"
//                   />
//                   <span className="input-unit">{input.filterType === "Suction" ? "mg/m³" : "ppm"}</span>
//                 </div>
//               </div>

//               {/* Dust Content */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Inlet Dust Content (micron) <span className="optional">(optional)</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.dustContent}
//                     onChange={e => setInput({ ...input, dustContent: e.target.value })}
//                     onKeyPress={handleNumberKeyPress}
//                     placeholder="Enter dust content"
//                   />
//                   <span className="input-unit">micron</span>
//                 </div>
//               </div>

//               {/* Duplex Filtration */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Outlet Filtration (micron) <span className="required">*</span>
//                 </label>
//                 <select 
//                   value={input.DuplexFiltration} 
//                   onChange={e => setInput({ ...input, DuplexFiltration: Number(e.target.value) })}
//                 >
//                   <option value="">-- Select Filtration --</option>
//                   <option value={25}>25 micron</option>
//                   <option value={5}>5 micron</option>
//                   <option value={1}>1 micron</option>
//                   <option value={0.01}>0.01 micron</option>
//                   <option value={0.003}>0.003 mg/m3</option>
//                 </select>
//               </div>

//               {/* Duplex Oil Residual */}
//               <div className="form-group">
//                 <label className="form-label">
//                   Outlet Oil Residual (mg/m3) <span className="optional">(optional)</span>
//                 </label>
//                 <div className="input-wrapper">
//                   <input
//                     type="number"
//                     value={input.DuplexOilResidual}
//                     onChange={e => setInput({ ...input, DuplexOilResidual: e.target.value })}
//                     onKeyPress={handleNumberKeyPress}
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
//                     <label className="form-label">
//                       Fittings <span className="optional">(optional)</span>
//                     </label>
//                     <select 
//                       value={input.fittings} 
//                       onChange={e => setInput({ ...input, fittings: e.target.value })}
//                     >
//                       <option value="">-- Select Fittings --</option>
//                       {CONFIG.fittingsOptions.map(fitting => (
//                         <option key={fitting}>{fitting}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Drain Type */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Type of Drain <span className="optional">(optional)</span>
//                     </label>
//                     <select 
//                       value={input.drainType} 
//                       onChange={e => setInput({ ...input, drainType: e.target.value })}
//                     >
//                       <option value="">-- Select Drain Type --</option>
//                       <option>Manual Drain (1/4" NPTF Needle Valve)</option>
//                       <option>Other</option>
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
//               {result && (
//                 <>
//                   <button className="btn btn-pdf" onClick={handlePrintPDF}>
//                     <span>📄</span> Print to PDF
//                   </button>
//                   <button 
//                     className="btn btn-calculations" 
//                     onClick={() => setShowCalculations(!showCalculations)}
//                   >
//                     <span>📊</span> {showCalculations ? 'Hide' : 'View'} Calculations
//                   </button>
//                 </>
//               )}
//             </div>

//             {result && !showCalculations && (
//               <div className="result-section">
//                 <div className="section-title">Result</div>
                
//                 <div className="result-card">
//                   <div className="final-result">
//                     <div className="final-result-content">
//                       <div className="final-result-grid">
//                         <div className="final-result-item">
//                           <div className="final-label">Selected Housing Model</div>
//                           <div className="final-value">{result.housing}</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {result && showCalculations && (
//               <div className="result-section">
//                 <div className="section-title">Detailed Calculation Results</div>
                
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



// ------------------------------------------------------------------------------------------------


import React, { useState, useEffect } from "react";
import CONFIG from "./filterConfig.json";
import {
  getPressureFactor,
  getTempFactor,
  selectHousing,
  getAppropriatePressureTier
} from "./filterUtils";
import { generateReport, viewReport, downloadReport } from "./pdfGenerator";
import bgGasFilter from "./assets/bg-gas-filter4.png";
import bekoLogo from "./assets/Beko-logo.png";
import "./FilterSizingCalculator.css";

/* ===========================
   PASSWORD CONFIG
   =========================== */
const APP_PASSWORD = "Beko@123"; // change before delivery
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function FilterSizingCalculator() {
  /* ===========================
     AUTHENTICATION STATE
     =========================== */
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  /* ===========================
     LOCKOUT TIMER EFFECT
     =========================== */
  useEffect(() => {
    let interval;
    
    if (isLocked && lockoutEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = lockoutEndTime - now;
        
        if (timeLeft <= 0) {
          // Lockout period ended
          setIsLocked(false);
          setLockoutEndTime(null);
          setFailedAttempts(0);
          setRemainingTime(0);
          setError("");
          setPassword("");
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, lockoutEndTime]);

  /* ===========================
     HELPER: Format remaining time
     =========================== */
  const formatRemainingTime = (milliseconds) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /* ===========================
     FORM STATE
     =========================== */
  const DEFAULT_SUCTION_INPUT = {
    customerName: "",
    filterType: "",
    filterTypeOption: "",
    filterScope: "",
    gas: "",
    flow: "",
    minPressure: "",
    maxPressure: "",
    temperature: "",
    endConnection: "",
    moistureContent: "",
    oilContent: "",
    dustContent: "",
    DuplexFiltration: "",
    DuplexOilResidual: "",
    moc: ""
  };

  const DEFAULT_DISCHARGE_INPUT = {
    customerName: "",
    filterType: "",
    filterTypeOption: "",
    filterScope: "",
    gas: "",
    flow: "",
    minPressure: "",
    maxPressure: "",
    temperature: "",
    endConnection: "",
    oilContent: "",
    dustContent: "",
    DuplexFiltration: "",
    DuplexOilResidual: "",
    fittings: "",
    drainType: "",
    moc: ""
  };

  const [result, setResult] = useState(null);
  const [input, setInput] = useState({
    customerName: "",
    filterType: "",
    filterTypeOption: "",
    filterScope: "",
    gas: "",
    flow: "",
    minPressure: "",
    maxPressure: "",
    temperature: "",
    endConnection: "",
    moistureContent: "",
    oilContent: "",
    dustContent: "",
    DuplexFiltration: "",
    DuplexOilResidual: "",
    fittings: "",
    drainType: "",
    moc: ""
  });
  const [showCalculations, setShowCalculations] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  /* ===========================
     AUTHENTICATION HANDLER
     =========================== */
  const handleLogin = () => {
    // Check if locked
    if (isLocked) {
      return; // Don't process if locked
    }

    if (password === APP_PASSWORD) {
      setAuthenticated(true);
      setError("");
      setFailedAttempts(0);
      setPassword("");
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        // Lock the application
        const endTime = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutEndTime(endTime);
        setRemainingTime(LOCKOUT_DURATION);
        setError(`Too many failed attempts. Application locked for 5 minutes.`);
        setPassword("");
      } else {
        const attemptsLeft = MAX_ATTEMPTS - newAttempts;
        setError(`Invalid password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
        setPassword("");
      }
    }
  };

  /* ===========================
     HELPER FUNCTION TO SHOW ERROR MODAL
     =========================== */
  const showError = (message) => {
    setErrorModal({ show: true, message });
  };

  const closeErrorModal = () => {
    setErrorModal({ show: false, message: "" });
  };

  /* ===========================
     CALCULATION FUNCTIONS
     =========================== */
  const calculate = () => {
    // Validate required fields only
    if (!input.filterType) {
      showError("Please select Type of Filter");
      return;
    }
    if (!input.gas) {
      showError("Please select Type of Gas");
      return;
    }
    if (!input.flow) {
      showError("Please enter Flow Rate");
      return;
    }
    if (!input.minPressure) {
      showError("Please enter Min. Working Pressure");
      return;
    }
    
    // Validate pressure ranges based on filter type
    const minPressure = Number(input.minPressure);
    const maxPressure = Number(input.maxPressure);
    
    if (input.filterType === "Flanged Filter") {
      if (minPressure < 1 || minPressure > 100) {
        showError("For Flanged filters, Min. Working Pressure must be between 1 and 100 barg");
        return;
      }
      if (input.maxPressure && (maxPressure < 1 || maxPressure > 100)) {
        showError("For Flanged filters, Max. Pressure must be between 1 and 100 barg");
        return;
      }
    } else if (input.filterType === "High Pressure Threaded Filter") {
      if (minPressure < 1 || minPressure > 500) {
        showError("For Discharge filters, Min. Working Pressure must be between 1 and 500 barg");
        return;
      }
      if (input.maxPressure && (maxPressure < 1 || maxPressure > 500)) {
        showError("For Discharge filters, Max. Pressure must be between 1 and 500 barg");
        return;
      }
    }
    
    if (!input.temperature) {
      showError("Please enter Inlet Air Temperature");
      return;
    }
    if (!input.DuplexFiltration) {
      showError("Please select Outlet Filtration (micron)");
      return;
    }

    const gas = CONFIG.gases[input.gas];
    const gasFactor = gas.gasFactor;
    const mwra = gas.mwra;

    const pf = getPressureFactor(input.filterType, input.minPressure, CONFIG.pressureFactors);
    const tf = getTempFactor(input.temperature, CONFIG.temperature.base);

    const totalFactor = gasFactor * pf * tf;
    const initialFlow = Number(input.flow) / totalFactor;
    const finalFlow = initialFlow * mwra;

    let models;
    if (input.filterType === "Flanged Filter") {
      models = CONFIG.suctionModels;
    } else {
      const targetPressure = getAppropriatePressureTier(input.minPressure);
      models = CONFIG.dischargeModels.filter(
        m => m.pressure === targetPressure && !CONFIG.exclusions.includes(m.model)
      );
    }

    const housing = selectHousing(models, finalFlow);

    // Check if selected housing requires 'W' instead of 'D' for special models
    const specialModels = ["HP100S040", "HP350S030", "HP500S030"];
    const isSpecialModel = specialModels.includes(housing.model);
    const dpSuffix = isSpecialModel ? "M" : CONFIG.suffixes.dp;
    const stageDSuffix = isSpecialModel ? "W" : "D"; // 'W' for special models, 'D' for regular

    let housingModel = "";

    // DISCHARGE FILTER LOGIC - Multi-stage based on oil content
    if (input.filterType === "High Pressure Threaded Filter") {
      const oilContent = Number(input.oilContent) || 0;
      const temperature = Number(input.temperature);
      const baseHousing = housing.model; // e.g., HP100M015

      if (oilContent === 0 || !input.oilContent) {
        // No oil content provided - Single stage with standard outlet micron
        housingModel = baseHousing + CONFIG.suffixes.filtration[input.DuplexFiltration] + 
                       dpSuffix + CONFIG.suffixes.drain;
      } else if (oilContent <= 50) {
        // Low oil content (≤ 50 ppm) - Single stage FDM or FWM
        housingModel = `${baseHousing}F${stageDSuffix}M`;
      } else if (oilContent > 50 && oilContent < 100) {
        // Medium oil content (>50 to <100 ppm) - Two stages: FDM/FWM + SDM/SWM
        housingModel = `${baseHousing}F${stageDSuffix}M + S${stageDSuffix}M`;
      } else if (oilContent >= 100 && oilContent <= 200) {
        // High oil content (100-200 ppm) - Three stages: FDM/FWM + SDM/SWM + (SDM/SWM or AWM)
        // Final stage depends on gas type: Helium uses SDM/SWM, others use AWM
        const finalStage = input.gas === "Helium" ? `S${stageDSuffix}M` : "AWM";
        housingModel = `${baseHousing}F${stageDSuffix}M + S${stageDSuffix}M + ${finalStage}`;
      } else {
        // Oil content > 200 ppm - Show error or use maximum configuration
        showError("Oil content exceeds 200 ppm. Please contact technical support for custom configuration.");
        return;
      }

      // Apply Duplex logic for discharge filters if selected
      if (input.filterScope === "Duplex") {
        housingModel = `${housingModel} + ${housingModel}`;
      }

    } else {
      // Flanged Filter FILTER LOGIC (existing logic)
      housingModel =
        housing.model +
        CONFIG.suffixes.filtration[input.DuplexFiltration] +
        CONFIG.suffixes.dp +
        CONFIG.suffixes.drain;

      // Add /spl suffix for Flanged Filter filters when MOC is selected
      if (input.moc) {
        housingModel += "/spl";
      }

      // If Duplex is selected, double the housing model
      if (input.filterScope === "Duplex") {
        housingModel = `${housingModel} + ${housingModel}`;
      }
    }

    setResult({
      gasFactor,
      mwra,
      pf,
      tf,
      totalFactor,
      initialFlow,
      finalFlow,
      housing: housingModel,
      moc: input.moc,
      drainType: input.filterType === "High Pressure Threaded Filter" ? input.drainType : "Manual Drain",
      fittings: input.filterType === "High Pressure Threaded Filter" ? input.fittings : null
    });

    // Reset calculations view and any previously generated report when a new calculation is done
    setShowCalculations(false);
    setReportData(null);
  };

  const resetForm = () => {
    setInput({
      customerName: "",
      filterType: "",
      filterTypeOption: "",
      filterScope: "",
      gas: "",
      flow: "",
      minPressure: "",
      maxPressure: "",
      temperature: "",
      endConnection: "",
      moistureContent: "",
      oilContent: "",
      dustContent: "",
      DuplexFiltration: "",
      DuplexOilResidual: "",
      fittings: "",
      drainType: "",
      moc: ""
    });
    setResult(null);
    setShowCalculations(false);
    setReportData(null);
  };

  const handleFilterTypeChange = (newType) => {
    setInput({ ...input, filterType: newType, filterTypeOption: "", filterScope: "" });
    setResult(null);
    setShowCalculations(false);
    setReportData(null);
  };

  const ensureReport = async () => {
    if (reportData) return reportData;
    const data = await generateReport(input, result);
    setReportData(data);
    return data;
  };

  const handleViewReport = async () => {
    if (!result) {
      showError("Please calculate the selection first before generating the report");
      return;
    }
    setReportLoading(true);
    try {
      const data = await ensureReport();
      await viewReport(data);
    } catch (err) {
      showError("Failed to generate the report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) {
      showError("Please calculate the selection first before generating the report");
      return;
    }
    setReportLoading(true);
    try {
      const data = await ensureReport();
      await downloadReport(data);
    } catch (err) {
      showError("Failed to generate the report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  /* ===========================
     HELPER: Get max pressure limit based on filter type
     =========================== */
  const getMaxPressureLimit = () => {
    if (input.filterType === "Flanged Filter") return 100;
    if (input.filterType === "High Pressure Threaded Filter") return 500;
    return 500; // default
  };

  /* ===========================
     HELPER: Get filter scope options based on filter type
     =========================== */
  const getFilterScopeOptions = () => {
    if (input.filterType === "Flanged Filter") {
      return ["Simplex", "Duplex"];
    } else if (input.filterType === "High Pressure Threaded Filter") {
      return ["High Pressure Threaded Filter"];
    }
    return []; // default when no filter type selected
  };

  /* ===========================
     HELPER: Get filter type options based on Type of Filter
     =========================== */
  const getFilterTypeOptions = () => {
    if (input.filterType === "Flanged Filter") {
      return ["Flanged"];
    } else if (input.filterType === "High Pressure Threaded Filter") {
      return ["High Pressure Discharge Pressure"];
    }
    return []; 
  };

  /* ===========================
     HELPER: Prevent invalid characters in number inputs
     =========================== */
  const handleNumberKeyPress = (e) => {
    // Prevent: e, E, +, -, .
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
      e.preventDefault();
    }
  };

  /* ===========================
     PASSWORD SCREEN
     =========================== */
  
  if (!authenticated) {
    return (
      <div
        className="auth-container"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(15, 23, 42, 0.55),
              rgba(15, 23, 42, 0.55)
            ),
            url(${bgGasFilter})
          `,
        }}
      >
        <div className="auth-card">
          <div className="auth-icon">
            {isLocked ? '🔒' : '🔓'}
          </div>

          <h2 className="auth-title">
            {isLocked ? 'Application Locked' : 'Authentication Required'}
          </h2>

          <p className="auth-subtitle">
            {isLocked 
              ? `Too many failed attempts. Please wait before trying again.`
              : 'Enter your password to access the application'
            }
          </p>

          {!isLocked && (
            <>
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your password"
                disabled={isLocked}
              />

              {error && (
                <p className="auth-error">{error}</p>
              )}

              <button 
                onClick={handleLogin} 
                className="auth-button"
                disabled={isLocked}
              >
                Unlock Application
              </button>
            </>
          )}

          {isLocked && (
            <div className="lockout-timer">
              <div className="timer-display">
                <div className="timer-icon">⏱️</div>
                <div className="timer-text">{formatRemainingTime(remainingTime)}</div>
              </div>
              <p className="lockout-message">
                The application will automatically unlock when the timer reaches zero.
              </p>
            </div>
          )}

          <div className="auth-footer-note">
            🔐 For security: Password is encrypted and the application will
            lock for 5 minutes after {MAX_ATTEMPTS} failed attempts.
          </div>
        </div>
      </div>
    );
  }

  /* ===========================
     MAIN APPLICATION
     =========================== */

  return (
    <div className="page">
      {/* ERROR MODAL */}
      {errorModal.show && (
        <div className="modal-overlay" onClick={closeErrorModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">⚠️ Validation Error</h3>
            </div>
            <div className="modal-body">
              <p>{errorModal.message}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeErrorModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="header-content">
              <div className="header-top">
                <div className="header-left">
                  <div className="icon-wrapper">♻️</div>
                  <div>
                    <h1>Beko Filter Selection Tool</h1>
                    <p className="header-subtitle">
                      Beko Advanced Filter Sizing Tool
                    </p>
                  </div>
                </div>
                <div className="header-right">
                  <img src={bekoLogo} alt="Beko Logo" className="beko-logo" />
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="section-title">Configuration Parameters</div>

            <div className="grid">
              {/* Customer Name */}
              <div className="form-group">
                <label className="form-label">
                  Customer Name <span className="optional">(optional)</span>
                </label>
                <input
                  type="text"
                  value={input.customerName}
                  onChange={e => setInput({ ...input, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>

              {/* Filter Type */}
              <div className="form-group">
                <label className="form-label">
                  Filter Selection <span className="required">*</span>
                </label>
                <select 
                  value={input.filterType} 
                  onChange={e => handleFilterTypeChange(e.target.value)}
                >
                  <option value="">-- Select Filter Type --</option>
                  <option>Flanged Filter</option>
                  <option>High Pressure Threaded Filter</option>
                </select>
              </div>

              {/* Filter Type Option */}
              {/* <div className="form-group">
                <label className="form-label">
                  Filter Type <span className="optional">(optional)</span>
                </label>
                <select 
                  value={input.filterTypeOption} 
                  onChange={e => setInput({ ...input, filterTypeOption: e.target.value })}
                  disabled={!input.filterType}
                >
                  <option value="">-- Select Filter Type --</option>
                  {getFilterTypeOptions().map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div> */}

              {/* Filter Scope */}
              <div className="form-group">
                <label className="form-label">
                  Filter Scope <span className="optional">(optional)</span>
                </label>
                <select 
                  value={input.filterScope} 
                  onChange={e => setInput({ ...input, filterScope: e.target.value })}
                  disabled={!input.filterType}
                >
                  <option value="">-- Select Filter Scope --</option>
                  {getFilterScopeOptions().map(scope => (
                    <option key={scope}>{scope}</option>
                  ))}
                </select>
              </div>

              {/* Gas Type */}
              <div className="form-group">
                <label className="form-label">
                  Type of Gas <span className="required">*</span>
                </label>
                <select 
                  value={input.gas} 
                  onChange={e => setInput({ ...input, gas: e.target.value })}
                >
                  <option value="">-- Select Gas Type --</option>
                  {Object.keys(CONFIG.gases).map(g => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Flow Rate */}
              <div className="form-group">
                <label className="form-label">
                  Flow (m³/hr) <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={input.flow}
                    onChange={e => setInput({ ...input, flow: e.target.value })}
                    onKeyPress={handleNumberKeyPress}
                    placeholder="Enter flow rate"
                  />
                  <span className="input-unit">m³/hr</span>
                </div>
              </div>

              {/* Min Working Pressure */}
              <div className="form-group">
                <label className="form-label">
                  Min. Working Pressure (barg) <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    min="1"
                    max={getMaxPressureLimit()}
                    value={input.minPressure}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === "") {
                        setInput({ ...input, minPressure: "" });
                        return;
                      }
                      const num = Number(value);
                      const maxLimit = getMaxPressureLimit();
                      if (num >= 1 && num <= maxLimit) {
                        setInput({ ...input, minPressure: value });
                      }
                    }}
                    onKeyPress={handleNumberKeyPress}
                    placeholder="Enter min pressure"
                  />
                  <span className="input-unit">barg</span>
                </div>
              </div>

              {/* Max Pressure */}
              <div className="form-group">
                <label className="form-label">
                  Max. Pressure (barg) <span className="optional">(optional)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    min="1"
                    max={getMaxPressureLimit()}
                    value={input.maxPressure}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === "") {
                        setInput({ ...input, maxPressure: "" });
                        return;
                      }
                      const num = Number(value);
                      const maxLimit = getMaxPressureLimit();
                      if (num >= 1 && num <= maxLimit) {
                        setInput({ ...input, maxPressure: value });
                      }
                    }}
                    onKeyPress={handleNumberKeyPress}
                    placeholder="Enter max pressure"
                  />
                  <span className="input-unit">barg</span>
                </div>
              </div>

              {/* Inlet Air Temperature */}
              <div className="form-group">
                <label className="form-label">
                  Inlet Air Temperature (Deg.C) <span className="required">*</span>
                </label>

                <div className="input-wrapper">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={input.temperature}
                    placeholder="Enter temperature"
                    onChange={e => {
                      const value = e.target.value;

                      // allow empty for editing
                      if (value === "") {
                        setInput({ ...input, temperature: "" });
                        return;
                      }

                      const num = Number(value);

                      if (num >= 1 && num <= 100) {
                        setInput({ ...input, temperature: value });
                      }
                    }}
                    onKeyPress={handleNumberKeyPress}
                  />
                  <span className="input-unit">°C</span>
                </div>
              </div>


              {/* End Connection */}
              <div className="form-group">
                <label className="form-label">
                  End Connection<span className="optional">(optional)</span>
                </label>
                <select 
                  value={input.endConnection} 
                  onChange={e => setInput({ ...input, endConnection: e.target.value })}
                >
                  <option value="">-- Select Connection --</option>
                  {CONFIG.endConnections.map(conn => (
                    <option key={conn}>{conn}</option>
                  ))}
                </select>
              </div>

              {/* MOC of Housing */}
              <div className="form-group">
                <label className="form-label">
                  MOC of Housing <span className="optional">(optional)</span>
                </label>
                <select 
                  value={input.moc} 
                  onChange={e => setInput({ ...input, moc: e.target.value })}
                >
                  <option value="">-- Select MOC --</option>
                  {CONFIG.mocOptions.map(moc => (
                    <option key={moc}>{moc}</option>
                  ))}
                </select>
              </div>

              {/* Moisture Content - Flanged Filter Only */}
              {input.filterType === "Flanged Filter" && (
                <div className="form-group">
                  <label className="form-label">
                    Simplex Moisture Content <span className="optional">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={input.moistureContent}
                    onChange={e => setInput({ ...input, moistureContent: e.target.value })}
                    placeholder="Enter moisture content"
                  />
                </div>
              )}

              {/* Oil Content */}
              <div className="form-group">
                <label className="form-label">
                  Inlet Oil Content {input.filterType === "Flanged Filter" ? "(mg/m3)" : "(ppm)"} <span className="optional">(optional)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={input.oilContent}
                    onChange={e => setInput({ ...input, oilContent: e.target.value })}
                    onKeyPress={handleNumberKeyPress}
                    placeholder="Enter oil content"
                  />
                  <span className="input-unit">{input.filterType === "Flanged Filter" ? "mg/m³" : "ppm"}</span>
                </div>
              </div>

              {/* Dust Content */}
              <div className="form-group">
                <label className="form-label">
                  Inlet Dust Content (micron) <span className="optional">(optional)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={input.dustContent}
                    onChange={e => setInput({ ...input, dustContent: e.target.value })}
                    onKeyPress={handleNumberKeyPress}
                    placeholder="Enter dust content"
                  />
                  <span className="input-unit">micron</span>
                </div>
              </div>

              {/* Duplex Filtration */}
              <div className="form-group">
                <label className="form-label">
                  Outlet Filtration (micron) <span className="required">*</span>
                </label>
                <select 
                  value={input.DuplexFiltration} 
                  onChange={e => setInput({ ...input, DuplexFiltration: Number(e.target.value) })}
                >
                  <option value="">-- Select Filtration --</option>
                  <option value={25}>25 micron</option>
                  <option value={5}>5 micron</option>
                  <option value={1}>1 micron</option>
                  <option value={0.01}>0.01 micron</option>
                  <option value={0.003}>0.003 mg/m3</option>
                </select>
              </div>

              {/* Duplex Oil Residual */}
              <div className="form-group">
                <label className="form-label">
                  Outlet Oil Residual (mg/m3) <span className="optional">(optional)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={input.DuplexOilResidual}
                    onChange={e => setInput({ ...input, DuplexOilResidual: e.target.value })}
                    onKeyPress={handleNumberKeyPress}
                    placeholder="Enter oil residual"
                  />
                  <span className="input-unit">mg/m³</span>
                </div>
              </div>

              {/* Discharge Filter Specific Fields */}
              {input.filterType === "High Pressure Threaded Filter" && (
                <>
                  {/* Fittings */}
                  <div className="form-group">
                    <label className="form-label">
                      Fittings <span className="optional">(optional)</span>
                    </label>
                    <select 
                      value={input.fittings} 
                      onChange={e => setInput({ ...input, fittings: e.target.value })}
                    >
                      <option value="">-- Select Fittings --</option>
                      {CONFIG.fittingsOptions.map(fitting => (
                        <option key={fitting}>{fitting}</option>
                      ))}
                    </select>
                  </div>

                  {/* Drain Type */}
                  <div className="form-group">
                    <label className="form-label">
                      Type of Drain <span className="optional">(optional)</span>
                    </label>
                    <select 
                      value={input.drainType} 
                      onChange={e => setInput({ ...input, drainType: e.target.value })}
                    >
                      <option value="">-- Select Drain Type --</option>
                      <option>Manual Drain</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="button-group">
              <button className="btn btn-primary" onClick={calculate}>
                <span>🔍</span> Calculate Selection
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                <span>↻</span> Reset Form
              </button>
              {result && (
                <>
                  <button className="btn btn-view" onClick={handleViewReport} disabled={reportLoading}>
                    <span>👁️</span> View Report
                  </button>
                  <button className="btn btn-download" onClick={handleDownloadReport} disabled={reportLoading}>
                    <span>⬇️</span> Download Report
                  </button>
                  <button 
                    className="btn btn-calculations" 
                    onClick={() => setShowCalculations(!showCalculations)}
                  >
                    <span>📊</span> {showCalculations ? 'Hide' : 'View'} Calculations
                  </button>
                </>
              )}
            </div>

            {result && !showCalculations && (
              <div className="result-section">
                <div className="section-title">Result</div>
                
                <div className="result-card">
                  <div className="final-result">
                    <div className="final-result-content">
                      <div className="final-result-grid">
                        <div className="final-result-item">
                          <div className="final-label">Selected Housing Model</div>
                          <div className="final-value">{result.housing}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && showCalculations && (
              <div className="result-section">
                <div className="section-title">Detailed Calculation Results</div>
                
                <div className="result-card">
                  <div className="result-grid">
                    <div className="result-item">
                      <div className="result-label">Gas Factor</div>
                      <div className="result-value">{result.gasFactor}</div>
                    </div>

                    <div className="result-item">
                      <div className="result-label">MWrA Factor</div>
                      <div className="result-value">{result.mwra}</div>
                    </div>

                    <div className="result-item">
                      <div className="result-label">Pressure Factor</div>
                      <div className="result-value">{result.pf.toFixed(3)}</div>
                    </div>

                    <div className="result-item">
                      <div className="result-label">Temperature Factor</div>
                      <div className="result-value">{result.tf.toFixed(3)}</div>
                    </div>

                    <div className="result-item">
                      <div className="result-label">Total Factor</div>
                      <div className="result-value">{result.totalFactor.toFixed(3)}</div>
                    </div>

                    <div className="result-item">
                      <div className="result-label">Initial Flow</div>
                      <div className="result-value">{result.initialFlow.toFixed(2)} m³/hr</div>
                    </div>

                    <div className="result-item">
                      <div className="result-label">Final Flow</div>
                      <div className="result-value">{result.finalFlow.toFixed(2)} m³/hr</div>
                    </div>
                  </div>

                  <div className="final-result">
                    <div className="final-result-content">
                      <div className="final-result-grid">
                        <div className="final-result-item">
                          <div className="final-label">Selected Housing Model</div>
                          <div className="final-value">{result.housing}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

