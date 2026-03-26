import { type Report } from '../features/report/components/IssueMapPicker';

export const mockReports: Report[] = [
  { 
    id: '1', 
    location_lat: 9.0212, 
    location_long: 38.7525, 
    title: 'Water Leakage', 
    status: 'submitted' 
  },
  { 
    id: '2', 
    location_lat: 9.0300, 
    location_long: 38.7400, 
    title: 'Pothole', 
    status: 'submitted' 
  },
    { id: '4', location_lat: 9.0350, location_long: 38.7520, title: 'Waste Accumulation - 4 Kilo', status: 'submitted' },

  { 
    id: '3', 
    location_lat: 9.0100, 
    location_long: 38.7600, 
    title: 'Fixed Light', 
    status: 'resolved' 
  },
  { id: '5', location_lat: 9.0120, location_long: 38.7350, title: 'Blocked Drainage - Mexico', status: 'submitted' },
  { id: '6', location_lat: 9.0280, location_long: 38.7890, title: 'Broken Sidewalk - Megenagna', status: 'submitted' },
  { id: '7', location_lat: 8.9850, location_long: 38.7550, title: 'Street Light Out - Saris', status: 'submitted' },
  { id: '8', location_lat: 9.0520, location_long: 38.7210, title: 'Pothole - Gullele', status: 'submitted' },
  { id: '9', location_lat: 9.0050, location_long: 38.7680, title: 'Damaged Pipe - Gerji', status: 'submitted' },
  { id: '10', location_lat: 9.0200, location_long: 38.7450, title: 'Manhole Cover Missing - Stadium', status: 'submitted' },
  { id: '11', location_lat: 9.0450, location_long: 38.7620, title: 'Illegal Dumping - Shola', status: 'submitted' },
];
