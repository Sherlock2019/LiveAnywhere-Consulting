import {
  BadgeDollarSign,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Car,
  FileCheck2,
  HeartPulse,
  House,
  Languages,
  PawPrint,
  Plane,
  Scale,
  School,
  Smartphone,
  Truck,
  UserRoundCheck,
} from "lucide-react";

export const goals = [
  { id: "retire", label: "Retire", icon: "🏖️" },
  { id: "work", label: "Find a job", icon: "💼" },
  { id: "remote-work", label: "Remote work", icon: "💻" },
  { id: "business", label: "Start a business", icon: "🚀" },
  { id: "invest", label: "Invest", icon: "◈" },
  { id: "family", label: "Join family", icon: "♥" },
  { id: "study", label: "Study", icon: "🎓" },
  { id: "long-stay", label: "Long-term living", icon: "🏡" },
  { id: "explore", label: "Explore options", icon: "◎" },
];

export const services = [
  { id: "visa-legal", name: "Visa & legal", icon: Scale, note: "Pathway screening and licensed-professional coordination" },
  { id: "documents", name: "Documents", icon: FileCheck2, note: "Preparation, translation and legalization support" },
  { id: "jobs", name: "Job", icon: BriefcaseBusiness, note: "Career positioning, search and employer matching" },
  { id: "housing", name: "Home", icon: House, note: "Temporary stays, rentals and local agents" },
  { id: "moving", name: "Movers", icon: Truck, note: "Quotes, packing, shipping and customs coordination" },
  { id: "travel", name: "Travel", icon: Plane, note: "Flights, arrivals and temporary accommodation" },
  { id: "healthcare", name: "Healthcare", icon: HeartPulse, note: "Insurance, hospitals and care navigation" },
  { id: "banking", name: "Banking", icon: Banknote, note: "Accounts, transfers and financial referrals" },
  { id: "school", name: "School", icon: School, note: "School search and family settling support" },
  { id: "business", name: "Business", icon: Building2, note: "Company setup and operational coordination" },
  { id: "investment", name: "Investment", icon: BadgeDollarSign, note: "Due-diligence and specialist referrals" },
  { id: "transport", name: "Transport", icon: Car, note: "Local mobility and licence support" },
  { id: "connectivity", name: "Phone & internet", icon: Smartphone, note: "SIM, broadband and essential utilities" },
  { id: "pets", name: "Pets", icon: PawPrint, note: "Pet travel and arrival coordination" },
  { id: "translation", name: "Translation", icon: Languages, note: "Documents and everyday interpretation" },
  { id: "concierge", name: "Local concierge", icon: UserRoundCheck, note: "A human point of contact after arrival" },
];

export const journeySteps = [
  ["01", "Dream", "Choose where life could go."],
  ["02", "Assess", "Share your household, goals and budget."],
  ["03", "Visa", "Explore potential lawful routes."],
  ["04", "Prepare", "Coordinate documents, work, home and logistics."],
  ["05", "Move", "Manage departure, shipping, travel and arrival."],
  ["06", "Settle", "Set up healthcare, banking, school and local life."],
  ["07", "Live", "Keep a local concierge when you need one."],
];

export const pricing = [
  { name: "Explore", price: "$199", lead: "Build a confident starting point.", features: ["Personal relocation assessment", "Visa route overview", "City recommendations", "Budget estimate", "Move checklist"] },
  { name: "Move", price: "From $1,499", lead: "Coordinate the critical foundations.", features: ["Everything in Explore", "Immigration administration support", "Document coordination", "Housing assistance", "Arrival setup", "Relocation manager"] },
  { name: "Complete move", price: "From $3,999", lead: "One team across the move.", featured: true, features: ["Everything in Move", "Moving and shipping coordination", "Home and job assistance", "Healthcare and banking setup", "Utilities and local orientation", "90-day settling support"] },
  { name: "Concierge", price: "Custom", lead: "For complex, executive or family moves.", features: ["Families and executives", "Investors and retirees", "Corporate relocation", "Door-to-door coordination", "Dedicated manager"] },
];

export const statItems = [
  ["16", "Move services", "Connected in one plan"],
  ["2", "Launch countries", "USA and Vietnam"],
  ["1", "Relocation manager", "One human point of contact"],
  ["100%", "One move dashboard", "Tasks, budget and progress together"],
];
