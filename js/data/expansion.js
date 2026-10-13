/**
 * Our Expansion — TD Profile_2026 (3).pdf page 4.
 * Coordinates curated for map pins (city centers / district seats).
 */

export const expansionIntro = {
  markerLabel: "Our Expansion",
  title: ["Our", "Expansion"],
  body: "TEAM DSR has delivered work across multiple cities in India and abroad, supporting projects in exhibitions, events, and related execution environments. Our footprint reflects both operational reach and the ability to handle diverse formats and locations.",
  punch: ["Across India.", "Across the Globe."],
};

/** All PDF national cities with real coordinates. */
export const nationalCities = [
  { name: "Abu Road", lat: 24.4823, lng: 72.7818 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Anand", lat: 22.5645, lng: 72.9289 },
  { name: "Ankleshwar", lat: 21.6262, lng: 73.015 },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433 },
  { name: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
  { name: "Bhuj", lat: 23.242, lng: 69.6669 },
  { name: "Dahej", lat: 21.7134, lng: 72.5901 },
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
  { name: "Goa", lat: 15.2993, lng: 74.124 },
  { name: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "Jamnagar", lat: 22.4707, lng: 70.0577 },
  { name: "Kevadiya", lat: 21.838, lng: 73.7191 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Kolhapur", lat: 16.705, lng: 74.2433 },
  { name: "Kutch", lat: 23.7337, lng: 69.8597 },
  { name: "Mehsana", lat: 23.588, lng: 72.3693 },
  { name: "Morbi", lat: 22.817, lng: 70.837 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Nadiad", lat: 22.6916, lng: 72.8634 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898 },
  { name: "Palanpur", lat: 24.1725, lng: 72.435 },
  { name: "Palghar", lat: 19.6967, lng: 72.7699 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
  { name: "Sanand", lat: 22.9922, lng: 72.384 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { name: "Unjha", lat: 23.8037, lng: 72.391 },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { name: "Vapi", lat: 20.3893, lng: 72.9106 },
];

export const globalRegions = [
  {
    country: "USA",
    cities: [
      { name: "Atlanta", lat: 33.749, lng: -84.388 },
      { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    ],
  },
  {
    country: "Hungary",
    cities: [{ name: "Budapest", lat: 47.4979, lng: 19.0402 }],
  },
  {
    country: "Germany",
    cities: [
      { name: "Munich", lat: 48.1351, lng: 11.582 },
      { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
    ],
  },
  {
    country: "Poland",
    cities: [{ name: "Warsaw", lat: 52.2297, lng: 21.0122 }],
  },
  {
    country: "Saudi Arabia",
    cities: [
      { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
      { name: "Jeddah", lat: 21.4858, lng: 39.1925 },
      { name: "Dammam", lat: 26.4207, lng: 50.0888 },
    ],
  },
  {
    country: "Oman",
    cities: [{ name: "Muscat", lat: 23.588, lng: 58.3829 }],
  },
];

/** Flat list of all global cities for map markers. */
export function getGlobalCities() {
  return globalRegions.flatMap((region) =>
    region.cities.map((city) => ({
      ...city,
      country: region.country,
    }))
  );
}
