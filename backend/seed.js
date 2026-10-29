const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Train = require('./models/Train');
const Facility = require('./models/Facility');
const Alert = require('./models/Alert');
const LostFound = require('./models/LostFound');
const CrowdData = require('./models/CrowdData');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/railway_station_db';

const sampleTrains = [
  {
    trainNumber: '12804',
    name: 'Swarna Jayanti Superfast Express',
    platform: '3',
    status: 'on-time',
    arrivalTime: '15:10',
    departureTime: '15:25',
    delay: 0,
    origin: 'Hazrat Nizamuddin (NZM)',
    destination: 'Visakhapatnam (VSKP)',
  },
  {
    trainNumber: '12695',
    name: 'Chennai–TVC Superfast Express',
    platform: '1',
    status: 'on-time',
    arrivalTime: '18:15',
    departureTime: '18:30',
    delay: 0,
    origin: 'Chennai Central (MAS)',
    destination: 'Thiruvananthapuram Central (TVC)',
  },
  {
    trainNumber: '12163',
    name: 'Chennai–Dadar Superfast Express',
    platform: '2',
    status: 'delayed',
    arrivalTime: '18:55',
    departureTime: '19:15',
    delay: 20,
    origin: 'Chennai Central (MAS)',
    destination: 'Mumbai Dadar (DR)',
  },
  {
    trainNumber: '22653',
    name: 'Vande Bharat Express (MAS–CBE)',
    platform: '1',
    status: 'on-time',
    arrivalTime: '05:45',
    departureTime: '06:00',
    delay: 0,
    origin: 'Chennai Central (MAS)',
    destination: 'Coimbatore Jn (CBE)',
  },
  {
    trainNumber: '12621',
    name: 'Tamil Nadu Express',
    platform: '3',
    status: 'on-time',
    arrivalTime: '07:10',
    departureTime: '07:25',
    delay: 0,
    origin: 'New Delhi (NDLS)',
    destination: 'Chennai Central (MAS)',
  },
  {
    trainNumber: '12842',
    name: 'Coromandel Express',
    platform: '5',
    status: 'on-time',
    arrivalTime: '06:45',
    departureTime: '07:00',
    delay: 0,
    origin: 'Chennai Central (MAS)',
    destination: 'Howrah Jn (HWH)',
  },
  {
    trainNumber: '12658',
    name: 'Bangalore Mail',
    platform: '1',
    status: 'delayed',
    arrivalTime: '21:30',
    departureTime: '21:50',
    delay: 20,
    origin: 'KSR Bengaluru (SBC)',
    destination: 'Chennai Central (MAS)',
  },
];

const sampleFacilities = [
  {
    name: 'Restroom 1 (Platform 1 - Divyangjan & Braille)',
    type: 'toilet',
    floor: 0,
    location: { x: 45, y: 120 },
    isAvailable: true,
    crowdLevel: 'low',
    description: 'Near Gate 1 entry, north end of Platform 1. Equipped with grab rails, low-height washbasin, emergency pull cord, and ramp access.',
    isAccessible: true,
  },
  {
    name: 'Restroom 2 (Platform 5 Public Restroom)',
    type: 'toilet',
    floor: 0,
    location: { x: 180, y: 60 },
    isAvailable: true,
    crowdLevel: 'high',
    description: 'Mid-section of Platform 5 near Pillar 22. Standard public sanitation facility.',
    isAccessible: false,
  },
  {
    name: 'Divyangjan Wheelchair & Sahayata Kendra',
    type: 'wheelchair',
    floor: 0,
    location: { x: 20, y: 50 },
    isAvailable: true,
    crowdLevel: 'low',
    description: 'Main Concourse inside Gate 1. Free station wheelchairs, battery buggy transfers, and escort assistance.',
    isAccessible: true,
  },
  {
    name: 'Medical Emergency & First Aid Booth',
    type: 'medical',
    floor: 0,
    location: { x: 90, y: 35 },
    isAvailable: true,
    crowdLevel: 'low',
    description: '24/7 Paramedics, AED automated defibrillator, emergency stretchers, and medicines.',
    isAccessible: true,
  },
  {
    name: 'Elevator to Foot Overbridge 1',
    type: 'elevator',
    floor: 0,
    location: { x: 110, y: 150 },
    isAvailable: true,
    crowdLevel: 'medium',
    description: 'Tactile floor buttons, voice announcements in 3 languages, wide entrance for power wheelchairs.',
    isAccessible: true,
  },
  {
    name: 'Accessible Ticket Counter (Counter 4 - Priority)',
    type: 'ticket',
    floor: 0,
    location: { x: 60, y: 80 },
    isAvailable: true,
    crowdLevel: 'medium',
    description: 'Lower counter height, hearing loop assistive induction system, priority queue for PwD and senior citizens.',
    isAccessible: true,
  },
  {
    name: 'State Bank ATM (Audio Jack & Braille Keypad)',
    type: 'atm',
    floor: 0,
    location: { x: 15, y: 140 },
    isAvailable: true,
    crowdLevel: 'low',
    description: 'Talking ATM with braille keypad and ramp entrance.',
    isAccessible: true,
  },
  {
    name: 'IRCTC Executive Waiting Lounge',
    type: 'waiting',
    floor: 1,
    location: { x: 130, y: 220 },
    isAvailable: true,
    crowdLevel: 'medium',
    description: 'Air-conditioned lounge with reclining chairs, charging stations, and accessible restrooms.',
    isAccessible: true,
  },
  {
    name: 'Railway Food Court & Refreshments',
    type: 'food',
    floor: 1,
    location: { x: 200, y: 240 },
    isAvailable: true,
    crowdLevel: 'high',
    description: 'Hygienic vegetarian and non-vegetarian food counters with wheelchair-accessible seating.',
    isAccessible: true,
  },
];

const sampleAlerts = [
  {
    type: 'info',
    message: 'Free wheelchair assistance is available at Concourse Gate 1.',
    area: 'Main Concourse',
    isActive: true,
  },
  {
    type: 'warning',
    message: 'Elevator at Platform 3 is undergoing routine maintenance until 18:00.',
    area: 'Platform 3',
    isActive: true,
  },
  {
    type: 'emergency',
    message: 'Special accessibility shuttle operating between Platform 1 and Platform 4.',
    area: 'Station-Wide',
    isActive: true,
  },
];

const sampleLostFound = [
  {
    itemName: 'Brown Leather Travel Wallet',
    description: 'Contains boarding pass, ID card under the name Priya, and some cash.',
    foundAt: 'Waiting Hall Bench #14',
    category: 'Keys & Wallets',
    contactInfo: 'Station Master Office: +91-11-23340000',
    status: 'found',
  },
  {
    itemName: 'Folding Carbon Fiber Mobility Cane',
    description: 'White cane with red reflective tip left behind near Ticket Counter 4.',
    foundAt: 'Ticket Counter 4',
    category: 'Accessibility Equipment',
    contactInfo: 'Lost & Found Booth, Gate 2',
    status: 'found',
  },
  {
    itemName: 'Black HP Laptop Bag',
    description: 'Black backpack with silver zippers, forgotten on seat near Platform 2.',
    foundAt: 'Platform 2 Escalator',
    category: 'Electronics',
    contactInfo: 'RPF Assistance Desk',
    status: 'lost',
  },
];

const sampleCrowdData = [
  { area: 'Platform 1', crowdLevel: 'high', count: 240 },
  { area: 'Platform 2', crowdLevel: 'medium', count: 110 },
  { area: 'Platform 3', crowdLevel: 'low', count: 45 },
  { area: 'Main Concourse', crowdLevel: 'high', count: 320 },
  { area: 'Ticket Counter', crowdLevel: 'medium', count: 85 },
  { area: 'Waiting Hall', crowdLevel: 'medium', count: 70 },
  { area: 'Food Court', crowdLevel: 'high', count: 160 },
  { area: 'Foot Overbridge', crowdLevel: 'low', count: 30 },
];

const sampleUsers = [
  {
    name: 'Station Admin',
    email: 'admin@railway.gov.in',
    password: 'password123',
    role: 'admin',
    accessibilityPreferences: {
      wheelchairRequired: false,
      audioAssistance: false,
      visualAssistance: false,
    },
    phone: '+91-9876543210',
  },
  {
    name: 'Accessibility Assistant Staff',
    email: 'staff@railway.gov.in',
    password: 'password123',
    role: 'staff',
    accessibilityPreferences: {
      wheelchairRequired: false,
      audioAssistance: false,
      visualAssistance: false,
    },
    phone: '+91-9876543211',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.passenger@example.com',
    password: 'password123',
    role: 'passenger',
    accessibilityPreferences: {
      wheelchairRequired: true,
      audioAssistance: true,
      visualAssistance: false,
      preferredLanguage: 'en',
    },
    phone: '+91-9812345678',
    emergencyContact: {
      name: 'Sunita Sharma',
      phone: '+91-9812345679',
      relation: 'Spouse',
    },
  },
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing collections
    console.log('Clearing existing data...');
    await Train.deleteMany({});
    await Facility.deleteMany({});
    await Alert.deleteMany({});
    await LostFound.deleteMany({});
    await CrowdData.deleteMany({});
    await User.deleteMany({});

    // Insert seeds
    console.log('Inserting trains...');
    await Train.insertMany(sampleTrains);

    console.log('Inserting facilities...');
    await Facility.insertMany(sampleFacilities);

    console.log('Inserting alerts...');
    await Alert.insertMany(sampleAlerts);

    console.log('Inserting lost & found items...');
    await LostFound.insertMany(sampleLostFound);

    console.log('Inserting crowd data...');
    await CrowdData.insertMany(sampleCrowdData);

    console.log('Inserting users...');
    for (const u of sampleUsers) {
      const userDoc = new User(u);
      await userDoc.save();
    }

    console.log('=======================================================');
    console.log(' Database seeded successfully with realistic railway data!');
    console.log(' Sample Admin Login: admin@railway.gov.in / password123');
    console.log(' Sample Passenger Login: rahul.passenger@example.com / password123');
    console.log('=======================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
