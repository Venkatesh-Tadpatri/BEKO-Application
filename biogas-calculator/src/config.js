// Filter Configuration
// This file contains all the configuration data for the filter calculator

export const CONFIG = {
  "filterTypes": {
    "Suction": {
      "displayName": "Suction Filter",
      "fields": [
        {
          "name": "filterType",
          "label": "Type of filter",
          "type": "text",
          "value": "Flanged",
          "readOnly": true
        },
        {
          "name": "filterScope",
          "label": "Filter scope",
          "type": "select",
          "options": ["Simplex / duplex"],
          "required": true
        },
        {
          "name": "gas",
          "label": "Type of Gas",
          "type": "select",
          "required": true
        },
        {
          "name": "flow",
          "label": "Flow (m³/hr)",
          "type": "number",
          "unit": "m³/hr",
          "required": true
        },
        {
          "name": "pressure",
          "label": "Min. working pressure (barg)",
          "type": "number",
          "unit": "barg",
          "required": true
        },
        {
          "name": "maxPressure",
          "label": "Max. pressure (barg)",
          "type": "number",
          "unit": "barg",
          "required": true
        },
        {
          "name": "temperature",
          "label": "Inlet air temperature (Deg.C)",
          "type": "number",
          "unit": "°C",
          "required": true
        },
        {
          "name": "endConnection",
          "label": "End connection (DN)",
          "type": "text",
          "required": false
        },
        {
          "name": "moistureContent",
          "label": "Inlet moisture content",
          "type": "text",
          "required": false
        },
        {
          "name": "oilContent",
          "label": "Inlet Oil content (mg/m3) (Optional)",
          "type": "number",
          "unit": "mg/m³",
          "required": false
        },
        {
          "name": "dustContent",
          "label": "Inlet Dust content (micron)",
          "type": "number",
          "unit": "micron",
          "required": false
        },
        {
          "name": "filtration",
          "label": "Outlet filtration (micron)",
          "type": "select",
          "options": [25, 5, 1, 0.01, 0.003],
          "required": true
        },
        {
          "name": "oilResidual",
          "label": "Outlet oil residual (mg/m3)",
          "type": "number",
          "unit": "mg/m³",
          "required": false
        }
      ]
    },
    "Discharge": {
      "displayName": "Discharge Filter",
      "fields": [
        {
          "name": "filterType",
          "label": "Type of filter",
          "type": "text",
          "value": "High Pressure Discharge Pressure",
          "readOnly": true
        },
        {
          "name": "filterScope",
          "label": "Filter scope",
          "type": "text",
          "value": "Discharge filter",
          "readOnly": true
        },
        {
          "name": "gas",
          "label": "Type of Gas",
          "type": "select",
          "required": true
        },
        {
          "name": "flow",
          "label": "Flow (m³/hr)",
          "type": "number",
          "unit": "m³/hr",
          "required": true
        },
        {
          "name": "pressure",
          "label": "Min. working pressure (barg)",
          "type": "number",
          "unit": "barg",
          "required": true
        },
        {
          "name": "maxPressure",
          "label": "Max. pressure (barg)",
          "type": "number",
          "unit": "barg",
          "required": true
        },
        {
          "name": "temperature",
          "label": "Inlet air temperature (Deg.C)",
          "type": "number",
          "unit": "°C",
          "required": true
        },
        {
          "name": "endConnection",
          "label": "End connection (in Inch) (Option for display)",
          "type": "select",
          "options": ["3/8\"", "1/4\"", "1/2\"", "3/4\"", "1\"", "1 1/2\"", "2\""],
          "placeholder": "Please provide the downlist",
          "required": false
        },
        {
          "name": "oilContent",
          "label": "Inlet Oil content (ppm) (optional)",
          "type": "number",
          "unit": "ppm",
          "required": false
        },
        {
          "name": "dustContent",
          "label": "Inlet Dust content (micron) (optional)",
          "type": "number",
          "unit": "micron",
          "required": false
        },
        {
          "name": "filtration",
          "label": "Outlet filtration (micron)",
          "type": "select",
          "options": [25, 5, 1, 0.01, 0.003],
          "required": true
        },
        {
          "name": "oilResidual",
          "label": "Outlet oil residual (mg/m3)",
          "type": "number",
          "unit": "mg/m³",
          "required": false
        },
        {
          "name": "fittings",
          "label": "Fittings (for output)",
          "type": "select",
          "options": ["Swagelok", "Parker", "Hylok"],
          "placeholder": "Please provide drop downlist",
          "required": false
        },
        {
          "name": "moc",
          "label": "MOC of housing (for output)",
          "type": "select",
          "options": ["SS304", "SS316", "Carbon Steel"],
          "placeholder": "Please provide dropdown list",
          "required": false
        },
        {
          "name": "drainType",
          "label": "Type of Drain (Manual Drain) (Display)",
          "type": "text",
          "value": "1/4\" NPTF Needle Valve",
          "readOnly": true
        }
      ]
    }
  },
  "gases": {
    "Passivation Air": {
      "gasFactor": 1,
      "mwra": 2
    },
    "Hydrogen (Dry)": {
      "gasFactor": 3.79,
      "mwra": 5
    },
    "Hydrogen (Saturated)": {
      "gasFactor": 3.79,
      "mwra": 7
    },
    "Helium": {
      "gasFactor": 2.69,
      "mwra": 10
    },
    "Biogas": {
      "gasFactor": 1.34,
      "mwra": 1.5
    },
    "Methane": {
      "gasFactor": 1.34,
      "mwra": 1.5
    },
    "CNG": {
      "gasFactor": 1.34,
      "mwra": 1.5
    },
    "N2": {
      "gasFactor": 1.01,
      "mwra": 1
    },
    "CO2": {
      "gasFactor": 0.81,
      "mwra": 1
    },
    "O2": {
      "gasFactor": 0.95,
      "mwra": 1
    },
    "Compressed Air/Argon": {
      "gasFactor": 1,
      "mwra": 1
    }
  },
  "pressureFactors": [
    {
      "type": "Flanged",
      "divisor": 7
    },
    {
      "type": "Discharge",
      "min": 0,
      "max": 100,
      "divisor": 100
    },
    {
      "type": "Discharge",
      "min": 100,
      "max": 350,
      "divisor": 350
    },
    {
      "type": "Discharge",
      "min": 350,
      "max": 500,
      "divisor": 500
    }
  ],
  "temperature": {
    "base": 20
  },
  "suctionModels": [
    {
      "model": "L085",
      "flow": 950
    },
    {
      "model": "L080",
      "flow": 1420
    },
    {
      "model": "L100",
      "flow": 2840
    },
    {
      "model": "L102",
      "flow": 4260
    },
    {
      "model": "L150",
      "flow": 5680
    },
    {
      "model": "L156",
      "flow": 9940
    },
    {
      "model": "L200",
      "flow": 11360
    },
    {
      "model": "L204",
      "flow": 14200
    },
    {
      "model": "L254",
      "flow": 19880
    },
    {
      "model": "L304",
      "flow": 31240
    }
  ],
  "dischargeModels": [
    {
      "model": "HP100S045",
      "flow": 100,
      "pressure": 100
    },
    {
      "model": "HP100S050",
      "flow": 200,
      "pressure": 100
    },
    {
      "model": "HP100S055",
      "flow": 460,
      "pressure": 100
    },
    {
      "model": "HP100S075",
      "flow": 680,
      "pressure": 100
    },
    {
      "model": "HP100M010",
      "flow": 1200,
      "pressure": 100
    },
    {
      "model": "HP100M015",
      "flow": 1700,
      "pressure": 100
    },
    {
      "model": "HP100M020",
      "flow": 3400,
      "pressure": 100
    },
    {
      "model": "HP350S040",
      "flow": 232,
      "pressure": 350
    },
    {
      "model": "HP350S045",
      "flow": 255,
      "pressure": 350
    },
    {
      "model": "HP350S050",
      "flow": 510,
      "pressure": 350
    },
    {
      "model": "HP350S075",
      "flow": 750,
      "pressure": 350
    },
    {
      "model": "HP350M010",
      "flow": 1330,
      "pressure": 350
    },
    {
      "model": "HP350M012",
      "flow": 2180,
      "pressure": 350
    },
    {
      "model": "HP350M015",
      "flow": 4360,
      "pressure": 350
    },
    {
      "model": "HP500S040",
      "flow": 121,
      "pressure": 500
    },
    {
      "model": "HP500S045",
      "flow": 278,
      "pressure": 500
    },
    {
      "model": "HP500S050",
      "flow": 556,
      "pressure": 500
    }
  ],
  "exclusions": [
    "HP100S040",
    "HP350S030",
    "HP500S030"
  ],
  "suffixes": {
    "filtration": {
      "25": "C",
      "5": "G",
      "1": "F",
      "0.01": "S",
      "0.003": "A"
    },
    "dp": "D",
    "drain": "M"
  }
};

export default CONFIG;
