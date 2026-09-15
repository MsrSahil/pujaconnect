import mongoose from 'mongoose';
import connectDB from './db.js';
import User from '../models/User.model.js';
import Pandit from '../models/Pandit.model.js';
import Puja from '../models/Puja.model.js';
import Availability from '../models/Availability.model.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to DB for seeding...');

    // 1. Seed Admin User
    const adminEmail = 'admin@pujaconnect.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'Admin@123',
        phone: '9876543210',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@pujaconnect.com / Admin@123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // 1b. Seed Demo Devotee User
    const userEmail = 'user@pujaconnect.com';
    let demoUser = await User.findOne({ email: userEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Rahul Sharma',
        email: userEmail,
        password: 'User@123',
        phone: '9822334455',
        role: 'user',
      });
      console.log('✅ Demo user created: user@pujaconnect.com / User@123');
    } else {
      console.log('ℹ️ Demo user already exists');
    }

    // 2. Seed Master Pujas
    const pujasData = [
      {
        name: 'Satyanarayan Katha',
        description: 'Auspicous ritual dedicated to Lord Vishnu for family prosperity and peace.',
        durationMinutes: 120,
        requiredMaterials: ['Flowers', 'Panchamrit', 'Banana leaves', 'Prasad', 'Incense'],
        priceRange: { min: 2100, max: 5100 },
        locationType: 'home',
        category: 'Katha & Paath',
      },
      {
        name: 'Griha Pravesh Puja',
        description: 'Sacred housewarming ceremony bringing positive energies into a new home.',
        durationMinutes: 180,
        requiredMaterials: ['Kalash', 'Mango leaves', 'Havan samagri', 'Ghee', 'Coconuts'],
        priceRange: { min: 5100, max: 11000 },
        locationType: 'home',
        category: 'Sanskar & Rites',
      },
      {
        name: 'Rudrabhishek',
        description: 'Vedic ritual of bathing the Shiva Lingam with sacred liquids and chanting mantras.',
        durationMinutes: 90,
        requiredMaterials: ['Bilva leaves', 'Milk', 'Honey', 'Ganga jal', 'Bhasma'],
        priceRange: { min: 3100, max: 7500 },
        locationType: 'both',
        category: 'Abhishek',
      },
      {
        name: 'Maha Lakshmi Puja',
        description: 'Worship of Goddess Lakshmi for wealth, success, and removal of financial obstacles.',
        durationMinutes: 60,
        requiredMaterials: ['Lotus flowers', 'Coins', 'Kumkum', 'Sweets', 'Diya'],
        priceRange: { min: 1500, max: 3500 },
        locationType: 'both',
        category: 'Festival & Special',
      }
    ];

    const seededPujas = [];
    for (const p of pujasData) {
      let existingPuja = await Puja.findOne({ name: p.name });
      if (!existingPuja) {
        existingPuja = await Puja.create(p);
        console.log(`✅ Puja created: ${p.name}`);
      }
      seededPujas.push(existingPuja);
    }

    // 3. Seed Reference Verified Pandit for User Flow testing
    const panditEmail = 'pandit.sharma@pujaconnect.com';
    let panditUser = await User.findOne({ email: panditEmail });
    let panditDoc;
    if (!panditUser) {
      panditUser = await User.create({
        name: 'Pandit Rajesh Sharma',
        email: panditEmail,
        password: 'Pandit@123',
        phone: '9811223344',
        role: 'pandit',
      });
      panditDoc = await Pandit.create({
        userId: panditUser._id,
        location: { city: 'Mumbai', state: 'Maharashtra' },
        experienceYears: 15,
        languagesSpoken: ['Hindi', 'Sanskrit', 'Marathi'],
        bio: 'Vedic scholar with 15 years experience conducting Satyanarayan, Griha Pravesh, and Rudrabhishek according to authentic shastras.',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        supportedRituals: seededPujas.map(p => p._id),
        verificationStatus: 'verified',
      });
      console.log('✅ Reference verified Pandit created: Pandit Rajesh Sharma');
    } else {
      panditDoc = await Pandit.findOne({ userId: panditUser._id });
    }

    // 4. Seed Availability for Pandit Sharma for today and upcoming 7 days
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i <= 7; i++) {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() + i);

      let avail = await Availability.findOne({ panditId: panditDoc._id, date });
      if (!avail) {
        await Availability.create({
          panditId: panditDoc._id,
          date,
          slots: [
            { startTime: '09:00', endTime: '11:00', isBooked: false },
            { startTime: '11:30', endTime: '13:30', isBooked: false },
            { startTime: '15:00', endTime: '17:00', isBooked: false },
            { startTime: '17:30', endTime: '19:30', isBooked: false },
          ]
        });
      }
    }
    console.log('✅ Availability slots seeded for Pandit Sharma');

    console.log('🎉 Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
