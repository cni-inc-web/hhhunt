// Only cities + the last three "Business Areas" are conditional.
// Everything else (top fields) always shows.

// Treat these as "checked"
const isChecked = v => {
  if (v == null) return false;
  const s = String(v).trim().toLowerCase();
  // common checkbox payloads: "on", "yes", "true", "1"
  return s !== "" && !["no", "false", "0", "off", "unchecked", "nil", "n"].includes(s);
};

const sectionIfAny = (title, lines) => {
  const visible = lines.filter(Boolean);
  if (!visible.length) return "";
  return `<strong>${title}</strong><br>${visible.join("<br>")}<br><br>`;
};

// ----- Top fields (ALWAYS VISIBLE) -----
const top = `
<strong>Company Name:</strong><br>
${inputData["Company-Name"] || ""}<br><br>

<strong>Company Website:</strong><br>
${inputData["Company-Website"] || ""}<br><br>

<strong>Point of Contact:</strong><br>
${inputData["Point-Of-Contact"] || ""}<br><br>

<strong>Email Address:</strong><br>
${inputData["Email"] || ""}<br><br>

<strong>Phone:</strong><br>
${inputData["Phone"] || ""}<br><br>

<strong>Services You Offer:</strong><br>
${inputData["Services-You-Offer"] || ""}<br><br>
`;

// ----- Cities (CONDITIONAL) -----
const md = sectionIfAny("Maryland", [
  isChecked(inputData["MD---Lexington-Park"]) ? `- Lexington Park: ${inputData["MD---Lexington-Park"]}` : "",
  isChecked(inputData["MD---Waldorf"]) ? `- Waldorf: ${inputData["MD---Waldorf"]}` : ""
]);

const va = sectionIfAny("Virginia", [
  isChecked(inputData["VA---Blacksburg"]) ? `- Blacksburg: ${inputData["VA---Blacksburg"]}` : "",
  isChecked(inputData["VA---Northern-VA"]) ? `- Northern VA: ${inputData["VA---Northern-VA"]}` : "",
  isChecked(inputData["VA---Hampton-Roads---Newport-News"]) ? `- Hampton Roads / Newport News: ${inputData["VA---Hampton-Roads---Newport-News"]}` : "",
  isChecked(inputData["VA---Greater-Richmond"]) ? `- Greater Richmond: ${inputData["VA---Greater-Richmond"]}` : ""
]);

const tn = sectionIfAny("Tennessee", [
  isChecked(inputData["TN---Nashville"]) ? `- Nashville: ${inputData["TN---Nashville"]}` : ""
]);

const nc = sectionIfAny("North Carolina", [
  isChecked(inputData["NC---Greater-Charlotte"]) ? `- Greater Charlotte: ${inputData["NC---Greater-Charlotte"]}` : "",
  isChecked(inputData["NC---Greensboro"]) ? `- Greensboro: ${inputData["NC---Greensboro"]}` : "",
  isChecked(inputData["NC---Raleigh---Durham"]) ? `- Raleigh / Durham: ${inputData["NC---Raleigh---Durham"]}` : "",
  isChecked(inputData["NC---Wilmington"]) ? `- Wilmington: ${inputData["NC---Wilmington"]}` : ""
]);

const sc = sectionIfAny("South Carolina", [
  isChecked(inputData["SC---Charleston-Metro"]) ? `- Charleston Metro: ${inputData["SC---Charleston-Metro"]}` : "",
  isChecked(inputData["SC---Hilton-Head-Island---Bluffton-Metropolitan"]) ? `- Hilton Head Island / Bluffton Metro: ${inputData["SC---Hilton-Head-Island---Bluffton-Metropolitan"]}` : "",
  isChecked(inputData["SC---Greenville"]) ? `- Greenville: ${inputData["SC---Greenville"]}` : "",
  isChecked(inputData["SC---Ridgeland"]) ? `- Ridgeland: ${inputData["SC---Ridgeland"]}` : "",
  isChecked(inputData["SC---West-Columbia"]) ? `- West Columbia: ${inputData["SC---West-Columbia"]}` : ""
]);

const ga = sectionIfAny("Georgia", [
  isChecked(inputData["GA---Atlanta"]) ? `- Atlanta: ${inputData["GA---Atlanta"]}` : ""
]);

const serviceAreas =
  `<strong>Your Service Area:</strong><br><br>` + md + va + tn + nc + sc + ga;

// ----- Business Areas (CONDITIONAL) -----
const business = sectionIfAny("Business Areas:", [
  isChecked(inputData["New-Home-Construction"]) ? `- New Homes Construction: ${inputData["New-Home-Construction"]}` : "",
  isChecked(inputData["Multi-Family-Construction"]) ? `- Multi-Family Construction: ${inputData["Multi-Family-Construction"]}` : "",
  isChecked(inputData["Planned-Residential-Community-Development"]) ? `- Planned Residential Community Development: ${inputData["Planned-Residential-Community-Development"]}` : ""
]);

// ----- Assemble -----
const html = top + serviceAreas + business;

return { html };
