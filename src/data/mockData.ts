export const campuses = [
  { id: "nairobi", name: "Nairobi", lat: -1.2921, lon: 36.8219 },
  { id: "mombasa", name: "Mombasa", lat: -4.0435, lon: 39.6682 },
  { id: "baringo", name: "Baringo", lat: 0.4667, lon: 35.9667 },
  { id: "embu", name: "Embu", lat: -0.5326, lon: 37.459 },
  { id: "matuga", name: "Matuga", lat: -4.335, lon: 39.56 },
];

export const now = () => new Date().toLocaleTimeString();

export const currentUser = {
  name: "Amina E.",
  email: "amina@ksg.ac.ke",
  role: "Supervisor",
  campus: "Nairobi",
};

export const sampleTickets = [
  { id: "TKT-1024", campus: "Nairobi", channel: "WhatsApp", type: "Facilities", priority: "High", status: "Open", sla: "2h", created: "08:31", title: "AC not working in Hall A", assignee: "J. Mwangi" },
  { id: "TKT-1025", campus: "Mombasa", channel: "USSD", type: "Hostel", priority: "Medium", status: "In Progress", sla: "8h", created: "08:40", title: "Water outage in Block C", assignee: "A. Otieno" },
  { id: "TKT-1026", campus: "Baringo", channel: "Web", type: "Catering", priority: "Low", status: "Open", sla: "24h", created: "08:45", title: "Vegetarian options limited", assignee: "Unassigned" },
  { id: "TKT-1027", campus: "Embu", channel: "Kiosk", type: "Security", priority: "Critical", status: "Escalated", sla: "60m", created: "08:48", title: "Medical emergency near Clinic", assignee: "Crisis Team" },
];

export const trafficSeries = [
  { time: "08:00", whatsapp: 32, ussd: 18, web: 10, kiosk: 6 },
  { time: "08:15", whatsapp: 40, ussd: 21, web: 15, kiosk: 9 },
  { time: "08:30", whatsapp: 55, ussd: 26, web: 18, kiosk: 12 },
  { time: "08:45", whatsapp: 63, ussd: 31, web: 19, kiosk: 13 },
  { time: "09:00", whatsapp: 71, ussd: 29, web: 24, kiosk: 14 },
];

export const sentimentByCampus = [
  { name: "Nairobi", positive: 62, neutral: 24, negative: 14 },
  { name: "Mombasa", positive: 58, neutral: 27, negative: 15 },
  { name: "Baringo", positive: 69, neutral: 20, negative: 11 },
  { name: "Embu", positive: 55, neutral: 23, negative: 22 },
  { name: "Matuga", positive: 64, neutral: 21, negative: 15 },
];

export const journeySteps = [
  { id: 1, title: "Discovery", detail: "Student scans QR poster", channel: "Web/Kiosk", time: "08:29", status: "done" },
  { id: 2, title: "Intake", detail: "Ticket logged (Facilities)", channel: "WhatsApp", time: "08:31", status: "done" },
  { id: 3, title: "Triage", detail: "KSGAI sets priority High", channel: "Agent", time: "08:32", status: "done" },
  { id: 4, title: "Assignment", detail: "Technician dispatched", channel: "Ops", time: "08:40", status: "active" },
  { id: 5, title: "Resolution", detail: "AC reset & tested", channel: "Ops", time: "09:15", status: "pending" },
  { id: 6, title: "Feedback", detail: "Student CSAT prompt", channel: "WhatsApp", time: "09:20", status: "pending" },
];

export const initialMessages = [
  { from: "agent", text: "Habari! I am KSGAI. How can I help today?" },
  { from: "user", text: "Wifi down near Library." },
  { from: "agent", text: "Noted. Is this Nairobi campus? I can alert ICT and create a ticket." },
];

export const publicInitial = [
  { from: "agent", text: "Karibu! This is KSGAI. Choose a channel below to start, or type here." },
];

export const onboardingPublic = [
  { id: "step1", title: "Choose channel", detail: "WhatsApp, USSD, or Web", status: "done" },
  { id: "step2", title: "Consent", detail: "Agree to data use & policy", status: "active" },
  { id: "step3", title: "Identify", detail: "Name or student no.", status: "pending" },
  { id: "step4", title: "Describe", detail: "Tell us the issue", status: "pending" },
  { id: "step5", title: "Track", detail: "Get ticket & updates", status: "pending" },
];
