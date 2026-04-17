export type Priority = "high" | "medium" | "low";

export interface OfficerTicket {
  id: string;
  title: string;
  location: string;
  priority: Priority;
  status: "new" | "in_progress" | "resolved";
  summary?: string;
  timeAgo?: string;
  reporter?: string;
  reporterPhone?: string;
  category?: string;
  resolutionDate?: string;
  lat?: number;
  lng?: number;
}

export interface OfficerMessage {
  id: string;
  from: "dispatch" | "officer";
  text: string;
  at: string;
}

export interface OfficerConversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  active?: boolean;
  online?: boolean;
  messages: OfficerMessage[];
}

export const officerTickets: OfficerTicket[] = [
  {
    id: "ISS-4921",
    title: "Deep Pothole on North Ave",
    location: "1400 North Ave, District 4",
    priority: "high",
    status: "new",
    summary:
      "There is a very large, deep pothole in the right lane going northbound. Several cars have hit it and it seems to be getting worse with the rain.",
    timeAgo: "2 hours ago",
    reporter: "Sarah Jenkins",
    reporterPhone: "(555) 019-2831",
    category: "Roads & Infrastructure",
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: "ISS-4918",
    title: "Offensive Graffiti on Park Wall",
    location: "Centennial Park, South Entrance",
    priority: "medium",
    status: "in_progress",
    timeAgo: "5 hours ago",
    reporter: "Marcus Reed",
    reporterPhone: "(555) 889-4471",
    category: "Vandalism",
    lat: 34.0409,
    lng: -118.2278,
  },
  {
    id: "ISS-4915",
    title: "Broken Streetlight at Intersection",
    location: "Corner of 5th St and Elm St",
    priority: "medium",
    status: "new",
    timeAgo: "1 day ago",
    reporter: "Paula Brown",
    reporterPhone: "(555) 201-5567",
    category: "Lighting",
    lat: 34.0386,
    lng: -118.2361,
  },
  {
    id: "ISS-4902",
    title: "Illegal Dumping in Alley",
    location: "Alley behind 890 West Blvd",
    priority: "low",
    status: "resolved",
    timeAgo: "3 days ago",
    reporter: "Public Works Crew 3",
    category: "Sanitation",
    resolutionDate: "Oct 10, 2023",
    lat: 34.0298,
    lng: -118.2511,
  },
];

export const resolvedTickets: OfficerTicket[] = [
  {
    id: "ISS-4895",
    title: "Pothole Repaired on Main St",
    location: "Main St",
    priority: "high",
    status: "resolved",
    category: "Roads & Infrastructure",
    resolutionDate: "Oct 15, 2023",
  },
  {
    id: "ISS-4892",
    title: "Graffiti Removed at Central Park",
    location: "Central Park",
    priority: "medium",
    status: "resolved",
    category: "Vandalism",
    resolutionDate: "Oct 14, 2023",
  },
  {
    id: "ISS-4888",
    title: "Streetlight Bulb Replaced (5th & Elm)",
    location: "5th & Elm",
    priority: "medium",
    status: "resolved",
    category: "Lighting",
    resolutionDate: "Oct 12, 2023",
  },
  {
    id: "ISS-4881",
    title: "Cleared Illegal Dumping in Alley",
    location: "West Blvd Alley",
    priority: "low",
    status: "resolved",
    category: "Sanitation",
    resolutionDate: "Oct 10, 2023",
  },
  {
    id: "ISS-4876",
    title: "Fallen Tree Branch Removed",
    location: "Park Zone 2",
    priority: "medium",
    status: "resolved",
    category: "Parks",
    resolutionDate: "Oct 09, 2023",
  },
  {
    id: "ISS-4870",
    title: "Fixed Broken Hydrant on West Blvd",
    location: "West Blvd",
    priority: "high",
    status: "resolved",
    category: "Water & Utilities",
    resolutionDate: "Oct 05, 2023",
  },
  {
    id: "ISS-4865",
    title: "Repainted Crosswalk at 1st Ave",
    location: "1st Ave",
    priority: "low",
    status: "resolved",
    category: "Roads & Infrastructure",
    resolutionDate: "Oct 02, 2023",
  },
  {
    id: "ISS-4859",
    title: "Replaced Damaged Stop Sign",
    location: "4th & Pine",
    priority: "medium",
    status: "resolved",
    category: "Traffic",
    resolutionDate: "Sep 28, 2023",
  },
];

export const chatThreads: OfficerConversation[] = [
  {
    id: "dispatch",
    name: "Dispatch Center",
    preview: "Unit 4 is en route to ISS-4921...",
    time: "10:42 AM",
    unread: 1,
    active: true,
    online: true,
    messages: [
      {
        id: "m1",
        from: "dispatch",
        at: "10:30 AM",
        text:
          "Officer Doe, we have a new high-priority ticket (ISS-4921) regarding a deep pothole on North Ave.",
      },
      {
        id: "m2",
        from: "officer",
        at: "10:32 AM",
        text:
          "Copy that, Dispatch. I'm finishing up at Centennial Park and will head over there in about 15 minutes.",
      },
      {
        id: "m3",
        from: "dispatch",
        at: "10:35 AM",
        text:
          "Understood. Unit 4 is in the vicinity and can dispatch them to bring traffic cones to secure the lane until you arrive.",
      },
      {
        id: "m4",
        from: "officer",
        at: "10:38 AM",
        text:
          "Yes, please confirm ETA for Unit 4 to ISS-4921. Traffic is building up on North Ave.",
      },
    ],
  },
  {
    id: "sarah",
    name: "Sarah Jenkins (ISS-4921)",
    preview: "Thank you for the quick response",
    time: "09:15 AM",
    unread: 0,
    active: false,
    messages: [
      {
        id: "s1",
        from: "dispatch",
        at: "09:00 AM",
        text: "Thanks for reporting this. A field officer has been assigned.",
      },
      {
        id: "s2",
        from: "officer",
        at: "09:15 AM",
        text: "Thank you for the quick response.",
      },
    ],
  },
  {
    id: "crew3",
    name: "Public Works Crew 3",
    preview: "We cleared the alleyway dumping.",
    time: "Yesterday",
    unread: 0,
    active: false,
    messages: [
      {
        id: "c1",
        from: "dispatch",
        at: "Yesterday",
        text: "Please confirm completion status for ISS-4902.",
      },
      {
        id: "c2",
        from: "officer",
        at: "Yesterday",
        text: "We cleared the alleyway dumping.",
      },
    ],
  },
  {
    id: "city-alerts",
    name: "City Hall Alerts",
    preview: "Weather advisory: Heavy rain expected",
    time: "Yesterday",
    unread: 0,
    active: false,
    messages: [
      {
        id: "a1",
        from: "dispatch",
        at: "Yesterday",
        text: "Weather advisory: Heavy rain expected from 18:00 to 23:00.",
      },
    ],
  },
  {
    id: "marcus",
    name: "Marcus Reed (ISS-4918)",
    preview: "Can you give me an update on this?",
    time: "Mon",
    unread: 0,
    active: false,
    messages: [
      {
        id: "r1",
        from: "dispatch",
        at: "Mon",
        text: "Can you give me an update on this?",
      },
    ],
  },
];
