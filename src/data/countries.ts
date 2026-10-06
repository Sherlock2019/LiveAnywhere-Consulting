export type Country = {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  center: [number, number];
  launch: boolean;
  note?: string;
};

export const countries: Country[] = [
  { id: "usa", name: "United States", shortName: "USA", flag: "🇺🇸", center: [-98.58, 39.83], launch: true },
  { id: "vietnam", name: "Vietnam", shortName: "Vietnam", flag: "🇻🇳", center: [108.28, 15.95], launch: true },
  { id: "thailand", name: "Thailand", shortName: "Thailand", flag: "🇹🇭", center: [100.99, 15.87], launch: false, note: "General relocation information only" },
  { id: "malaysia", name: "Malaysia", shortName: "Malaysia", flag: "🇲🇾", center: [101.98, 4.21], launch: false, note: "Coming soon" },
  { id: "france", name: "France", shortName: "France", flag: "🇫🇷", center: [2.21, 46.23], launch: false, note: "Coming soon" },
  { id: "portugal", name: "Portugal", shortName: "Portugal", flag: "🇵🇹", center: [-8.22, 39.4], launch: false, note: "Coming soon" },
  { id: "spain", name: "Spain", shortName: "Spain", flag: "🇪🇸", center: [-3.75, 40.46], launch: false, note: "Coming soon" },
  { id: "mexico", name: "Mexico", shortName: "Mexico", flag: "🇲🇽", center: [-102.55, 23.63], launch: false, note: "Coming soon" },
];

export type City = {
  id: string;
  countryId: string;
  name: string;
  tagline: string;
  highlights: string[];
  monthlyBudget: [number, number];
  image: string;
  imageCredit: string;
};

export const cities: City[] = [
  {
    id: "da-nang",
    countryId: "vietnam",
    name: "Da Nang",
    tagline: "Beach access, a calmer pace and strong everyday value.",
    highlights: ["Coastal lifestyle", "International community", "Compact city", "Regional airport"],
    monthlyBudget: [1800, 3200],
    image: "/images/da-nang.jpg",
    imageCredit: "Andrea Schaffer · CC BY 2.0 · Wikimedia Commons",
  },
  {
    id: "ho-chi-minh-city",
    countryId: "vietnam",
    name: "Ho Chi Minh City",
    tagline: "Vietnam's largest employment and international business market.",
    highlights: ["Business & technology", "International healthcare", "Broad housing choice", "Major air hub"],
    monthlyBudget: [2400, 4500],
    image: "/images/ho-chi-minh-city.jpg",
    imageCredit: "Tri Nguyen · CC BY 2.0 · Wikimedia Commons",
  },
  {
    id: "hanoi",
    countryId: "vietnam",
    name: "Hanoi",
    tagline: "Historic neighborhoods, national institutions and deep cultural life.",
    highlights: ["Culture & education", "Government & business", "Four seasons", "International schools"],
    monthlyBudget: [2100, 3900],
    image: "/images/hanoi.jpg",
    imageCredit: "Daderot · CC0 · Wikimedia Commons",
  },
  {
    id: "nha-trang",
    countryId: "vietnam",
    name: "Nha Trang",
    tagline: "A relaxed coastal base for long stays and lifestyle-led moves.",
    highlights: ["Beach lifestyle", "Lower living costs", "Compact center", "Leisure focus"],
    monthlyBudget: [1600, 2800],
    image: "/images/da-nang.jpg",
    imageCredit: "Illustrative coastal image · Andrea Schaffer · CC BY 2.0",
  },
];

export const countryById = (id: string) => countries.find((country) => country.id === id) ?? countries[0];
export const cityById = (id: string) => cities.find((city) => city.id === id);
