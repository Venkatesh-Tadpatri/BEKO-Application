// /**
//  * Utility functions for filter sizing calculations
//  */

// /**
//  * Calculate pressure factor based on filter type and minimum pressure
//  */
// export const getPressureFactor = (type, minPressure, pressureFactors) => {
//   const p = Number(minPressure);
//   let rule;

//   if (type === "Suction") {
//     rule = pressureFactors.find(r => r.type === "Flanged");
//   } else {
//     rule = pressureFactors.find(
//       r => r.type === "Discharge" && p > r.min && p <= r.max
//     );
//     if (!rule) {
//       rule = pressureFactors.find(r => r.type === "Discharge");
//     }
//   }

//   return Math.sqrt((p + 1) / (rule.divisor + 1));
// };

// /**
//  * Calculate temperature factor
//  */
// export const getTempFactor = (temperature, baseTemp) =>
//   Math.sqrt((273 + baseTemp) / (273 + Number(temperature)));

// /**
//  * Select appropriate housing based on flow
//  */
// export const selectHousing = (models, flow) => {
//   const sorted = [...models].sort((a, b) => a.flow - b.flow);
//   let chosen = sorted.find(m => flow <= m.flow) || sorted.at(-1);

//   if (flow > chosen.flow * 1.05) {
//     const idx = sorted.indexOf(chosen);
//     if (idx > 0) chosen = sorted[idx - 1];
//   }
//   return chosen;
// };

// /**
//  * Get appropriate pressure tier for discharge filters
//  */
// export const getAppropriatePressureTier = (requiredPressure) => {
//   const p = Number(requiredPressure);
//   const tiers = [100, 350, 500];
  
//   for (let tier of tiers) {
//     if (p <= tier) {
//       return tier;
//     }
//   }
  
//   return tiers[tiers.length - 1];
// };



/**
 * Utility functions for filter sizing calculations
 */

/**
 * Calculate pressure factor based on filter type and minimum pressure
 */
export const getPressureFactor = (type, minPressure, pressureFactors) => {
  const p = Number(minPressure);
  let rule;

  if (type === "Suction") {
    rule = pressureFactors.find(r => r.type === "Flanged");
  } else {
    rule = pressureFactors.find(
      r => r.type === "Discharge" && p > r.min && p <= r.max
    );
    if (!rule) {
      rule = pressureFactors.find(r => r.type === "Discharge");
    }
  }

  return Math.sqrt((p + 1) / (rule.divisor + 1));
};

/**
 * Calculate temperature factor
 */
export const getTempFactor = (temperature, baseTemp) =>
  Math.sqrt((273 + baseTemp) / (273 + Number(temperature)));

/**
 * Select appropriate housing based on flow
 */
export const selectHousing = (models, flow) => {
  const sorted = [...models].sort((a, b) => a.flow - b.flow);
  
  // Find the first model where flow is less than or equal to model capacity
  let chosen = sorted.find(m => flow <= m.flow);
  
  // If no model can handle the flow, use the largest available
  if (!chosen) {
    chosen = sorted.at(-1);
  }
  
  return chosen;
};

/**
 * Get appropriate pressure tier for discharge filters
 */
export const getAppropriatePressureTier = (requiredPressure) => {
  const p = Number(requiredPressure);
  const tiers = [100, 350, 500];
  
  for (let tier of tiers) {
    if (p <= tier) {
      return tier;
    }
  }
  
  return tiers[tiers.length - 1];
};

