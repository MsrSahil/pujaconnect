import mongoose from 'mongoose';
import connectDB from './db.js';
import User from '../models/User.model.js';
import Pandit from '../models/Pandit.model.js';
import Puja from '../models/Puja.model.js';
import Availability from '../models/Availability.model.js';

/**
 * PujaConnect Database Seeder
 * 
 * Safely seeds/updates:
 * - 1 Admin account
 * - 9 Master Pujas
 * - 5 Verified Pandits across major religious/cultural cities
 * - 7-day open availability slots for each pandit
 * 
 * Idempotent: Can be re-run safely without wiping data or duplicating records.
 */
const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB successfully.\n');

    let adminCreated = 0;
    let adminSkipped = 0;
    let pujasCreated = 0;
    let pujasSkipped = 0;
    let panditsCreated = 0;
    let panditsSkipped = 0;
    let availabilityCreated = 0;
    let availabilitySkipped = 0;

    // ─────────────────────────────────────────────────────────────
    // 1. SEED ADMIN ACCOUNT
    // ─────────────────────────────────────────────────────────────
    console.log('👑 Checking Admin account...');
    const adminEmail = 'admin@pujaconnect.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin@12345',
        phone: '9876543210',
        role: 'admin',
      });
      adminCreated++;
      console.log(`  ➕ Created Admin: ${adminEmail} (Role: admin)`);
    } else {
      adminSkipped++;
      console.log(`  ℹ️ Admin already exists: ${adminEmail}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 2. SEED MASTER PUJAS
    // ─────────────────────────────────────────────────────────────
    console.log('\n🪔 Checking Master Pujas...');
    const pujasData = [
      {
        name: 'Satyanarayan Katha',
        description: 'Auspicious ritual dedicated to Lord Vishnu for family prosperity, peace, and fulfillment of earnest desires.',
        durationMinutes: 120,
        requiredMaterials: ['Flowers & Garlands', 'Panchamrit', 'Banana Leaves', 'Rawa Halwa Prasad', 'Incense & Camphor', 'Betel leaves & nuts'],
        priceRange: { min: 2100, max: 5100 },
        locationType: 'home',
        category: 'Katha & Paath',
      },
      {
        name: 'Griha Pravesh Puja',
        description: 'Sacred housewarming ceremony purifying a new residence and inviting positive planetary energies and prosperity.',
        durationMinutes: 180,
        requiredMaterials: ['Kalash', 'Mango Leaves', 'Havan Samagri', 'Pure Desi Ghee', 'Dry Coconuts', 'Navdhanya', 'Toran'],
        priceRange: { min: 5100, max: 11000 },
        locationType: 'home',
        category: 'Sanskar & Rites',
      },
      {
        name: 'Naamkaran Sanskar',
        description: 'Traditional Vedic naming ceremony for newborns, invoking blessings of deities and ancestors for longevity and wisdom.',
        durationMinutes: 90,
        requiredMaterials: ['Honey', 'Silver Bowl & Coin', 'New Baby Cloth', 'Betel Leaves', 'Ganga Jal', 'Sweets'],
        priceRange: { min: 2500, max: 5500 },
        locationType: 'both',
        category: 'Sanskar & Rites',
      },
      {
        name: 'Vedic Havan & Yagya',
        description: 'Sacred fire ritual invoking Agni Dev to cleanse surrounding energy, dispel negativity, and attract health and success.',
        durationMinutes: 120,
        requiredMaterials: ['Havan Kund', 'Dry Wood (Samidha)', 'Havan Shakal', 'Pure Ghee', 'Guggul & Camphor', 'Purnahuti Cloth'],
        priceRange: { min: 3100, max: 7000 },
        locationType: 'both',
        category: 'Havan & Yagya',
      },
      {
        name: 'Mundan Sanskar',
        description: 'First tonsuring ceremony of a child, representing liberation from past-life impressions and fostering intellect and vitality.',
        durationMinutes: 75,
        requiredMaterials: ['Turmeric paste', 'Ganga Jal', 'Sacred thread (Kalawa)', 'New yellow towel', 'Curd & Honey'],
        priceRange: { min: 2100, max: 4500 },
        locationType: 'both',
        category: 'Sanskar & Rites',
      },
      {
        name: 'Rudrabhishek',
        description: 'Powerful Vedic ritual bathing the Shiva Lingam with sacred liquids while chanting Sri Rudram for peace, health, and removal of obstacles.',
        durationMinutes: 120,
        requiredMaterials: ['Bilva Patra', 'Cow Milk', 'Honey', 'Ganga Jal', 'Bhasma', 'Dhatura & Aak Flowers', 'Sandalwood Paste'],
        priceRange: { min: 3500, max: 8000 },
        locationType: 'both',
        category: 'Abhishek',
      },
      {
        name: 'Vastu Shanti Puja',
        description: 'Comprehensive pacification ceremony for Vastu Purusha, mitigating architectural imbalances and restoring harmony in homes and offices.',
        durationMinutes: 150,
        requiredMaterials: ['Navgrah Samidha', 'Red & White Cloth', 'Copper Coins', 'Ghee', 'Panchdhatu', 'Kalash'],
        priceRange: { min: 4500, max: 9500 },
        locationType: 'both',
        category: 'Sanskar & Rites',
      },
      {
        name: 'Ganesh Puja & Atharvashirsha',
        description: 'Vighnaharta pujan to remove all obstacles and bless auspicious new beginnings, business launches, and academic milestones.',
        durationMinutes: 60,
        requiredMaterials: ['Durva Grass (21 strands)', 'Modak/Laddoo', 'Red Hibiscus Flowers', 'Sindoor', 'Chandan', 'Panchamrit'],
        priceRange: { min: 1800, max: 3500 },
        locationType: 'both',
        category: 'Festival & Special',
      },
      {
        name: 'Maha Lakshmi Puja',
        description: 'Divine worship of Goddess Lakshmi and Lord Kuber for wealth, abundance, good fortune, and removal of financial hindrances.',
        durationMinutes: 90,
        requiredMaterials: ['Lotus Flowers', 'Silver/Gold Coins', 'Kumkum & Akshat', 'Makhana & Kheer Prasad', 'Camphor Diya'],
        priceRange: { min: 2500, max: 6000 },
        locationType: 'both',
        category: 'Festival & Special',
      },
    ];

    const seededPujas = [];
    for (const p of pujasData) {
      let existing = await Puja.findOne({ name: p.name });
      if (!existing) {
        existing = await Puja.create(p);
        pujasCreated++;
        console.log(`  ➕ Created Puja: "${p.name}" (${p.category})`);
      } else {
        pujasSkipped++;
        console.log(`  ℹ️ Puja already exists: "${p.name}"`);
      }
      seededPujas.push(existing);
    }

    // Helper map of puja names to ObjectIds
    const pujaMap = {};
    seededPujas.forEach((p) => {
      pujaMap[p.name] = p._id;
    });

    // ─────────────────────────────────────────────────────────────
    // 3. SEED 5 VERIFIED PANDITS
    // ─────────────────────────────────────────────────────────────
    console.log('\n🙏 Checking Verified Pandits...');
    const panditsSeedData = [
      {
        name: 'Pandit Rajesh Sharma',
        email: 'pandit.sharma@pujaconnect.com',
        password: 'Pandit@12345',
        phone: '9811223344',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        experienceYears: 18,
        languagesSpoken: ['Hindi', 'Sanskrit', 'Bhojpuri', 'English'],
        bio: 'Vedic Acharya from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi. Specializes in Rudrabhishek, Satyanarayan Katha, and Vedic Havans with authentic mantra uccharan.',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        supportedRituals: [
          pujaMap['Rudrabhishek'],
          pujaMap['Satyanarayan Katha'],
          pujaMap['Vedic Havan & Yagya'],
          pujaMap['Maha Lakshmi Puja'],
        ].filter(Boolean),
      },
      {
        name: 'Pandit Anand Shastri',
        email: 'pandit.shastri@pujaconnect.com',
        password: 'Pandit@12345',
        phone: '9822114455',
        city: 'Ujjain',
        state: 'Madhya Pradesh',
        experienceYears: 22,
        languagesSpoken: ['Hindi', 'Sanskrit', 'Malvi', 'English'],
        bio: 'Senior priest affiliated with Mahakaleshwar temple traditions in Ujjain. Expert in Kaal Sarp Dosh nivaran, Navgrah Shanti, and Mahamrityunjaya jaap.',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
        supportedRituals: [
          pujaMap['Rudrabhishek'],
          pujaMap['Vedic Havan & Yagya'],
          pujaMap['Ganesh Puja & Atharvashirsha'],
          pujaMap['Vastu Shanti Puja'],
        ].filter(Boolean),
      },
      {
        name: 'Pandit Rameshwar Joshi',
        email: 'pandit.joshi@pujaconnect.com',
        password: 'Pandit@12345',
        phone: '9833445566',
        city: 'Nashik',
        state: 'Maharashtra',
        experienceYears: 14,
        languagesSpoken: ['Hindi', 'Sanskrit', 'Marathi', 'English'],
        bio: 'Learned Purohit from Trimbakeshwar tradition in Nashik. Renowned for Griha Pravesh ceremonies, Vastu Shanti, and traditional Sanskar rituals.',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        supportedRituals: [
          pujaMap['Griha Pravesh Puja'],
          pujaMap['Vastu Shanti Puja'],
          pujaMap['Satyanarayan Katha'],
          pujaMap['Ganesh Puja & Atharvashirsha'],
        ].filter(Boolean),
      },
      {
        name: 'Pandit Devendra Dwivedi',
        email: 'pandit.dwivedi@pujaconnect.com',
        password: 'Pandit@12345',
        phone: '9844556677',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        experienceYears: 12,
        languagesSpoken: ['Hindi', 'Sanskrit', 'Braj Bhasha', 'English'],
        bio: 'Vrindavan-Mathura traditional priest. Specializes in Naamkaran Sanskar, Mundan rituals, and auspicious family Katha recitations.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        supportedRituals: [
          pujaMap['Naamkaran Sanskar'],
          pujaMap['Mundan Sanskar'],
          pujaMap['Satyanarayan Katha'],
          pujaMap['Maha Lakshmi Puja'],
        ].filter(Boolean),
      },
      {
        name: 'Pandit Suresh Tiwari',
        email: 'pandit.tiwari@pujaconnect.com',
        password: 'Pandit@12345',
        phone: '9855667788',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        experienceYears: 9,
        languagesSpoken: ['Hindi', 'Sanskrit', 'Bundelkhandi', 'English'],
        bio: 'Dedicated scholar and Purohit in Bhopal. Expert in Ganesh Puja, Vivah Sanskar rites, Mundan ceremonies, and household prosperity pujas.',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
        supportedRituals: [
          pujaMap['Ganesh Puja & Atharvashirsha'],
          pujaMap['Mundan Sanskar'],
          pujaMap['Satyanarayan Katha'],
          pujaMap['Vedic Havan & Yagya'],
        ].filter(Boolean),
      },
    ];

    const seededPanditDocs = [];

    for (const pData of panditsSeedData) {
      let pUser = await User.findOne({ email: pData.email });
      let wasCreated = false;

      if (!pUser) {
        pUser = await User.create({
          name: pData.name,
          email: pData.email,
          password: pData.password,
          phone: pData.phone,
          role: 'pandit',
        });
        wasCreated = true;
      }

      let pDoc = await Pandit.findOne({ userId: pUser._id });
      if (!pDoc) {
        pDoc = await Pandit.create({
          userId: pUser._id,
          location: { city: pData.city, state: pData.state },
          experienceYears: pData.experienceYears,
          languagesSpoken: pData.languagesSpoken,
          bio: pData.bio,
          photoUrl: pData.photoUrl,
          supportedRituals: pData.supportedRituals,
          verificationStatus: 'verified',
        });
        panditsCreated++;
        console.log(`  ➕ Created Pandit: ${pData.name} (${pData.city}) — Status: verified`);
      } else {
        // Ensure verificationStatus is verified and supported rituals are linked
        pDoc.verificationStatus = 'verified';
        if (pData.supportedRituals.length > 0) {
          pDoc.supportedRituals = pData.supportedRituals;
        }
        await pDoc.save();
        if (wasCreated) {
          panditsCreated++;
        } else {
          panditsSkipped++;
        }
        console.log(`  ℹ️ Pandit verified & updated: ${pData.name} (${pData.city})`);
      }

      seededPanditDocs.push(pDoc);
    }

    // ─────────────────────────────────────────────────────────────
    // 4. SEED 7-DAY AVAILABILITY SLOTS FOR EACH PANDIT
    // ─────────────────────────────────────────────────────────────
    console.log('\n📅 Checking 7-Day Availability Slots for Pandits...');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const defaultSlots = [
      { startTime: '09:00', endTime: '11:00', isBooked: false },
      { startTime: '11:30', endTime: '13:30', isBooked: false },
      { startTime: '15:00', endTime: '17:00', isBooked: false },
      { startTime: '17:30', endTime: '19:30', isBooked: false },
    ];

    for (const panditDoc of seededPanditDocs) {
      let pAvailCreated = 0;
      for (let i = 0; i <= 7; i++) {
        const slotDate = new Date(today);
        slotDate.setUTCDate(today.getUTCDate() + i);

        let existingAvail = await Availability.findOne({
          panditId: panditDoc._id,
          date: slotDate,
        });

        if (!existingAvail) {
          await Availability.create({
            panditId: panditDoc._id,
            date: slotDate,
            slots: defaultSlots,
          });
          availabilityCreated++;
          pAvailCreated++;
        } else {
          availabilitySkipped++;
        }
      }
      console.log(`  🗓️ Pandit ID ${panditDoc._id}: +${pAvailCreated} day slots added/verified.`);
    }

    // ─────────────────────────────────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────────────────────────────────
    console.log('\n========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY');
    console.log('========================================');
    console.log(`👑 Admin:        ${adminCreated} created, ${adminSkipped} skipped`);
    console.log(`🪔 Pujas:        ${pujasCreated} created, ${pujasSkipped} skipped (Total: ${pujasData.length})`);
    console.log(`🙏 Pandits:      ${panditsCreated} created, ${panditsSkipped} skipped (Total: ${panditsSeedData.length})`);
    console.log(`📅 Availability: ${availabilityCreated} created, ${availabilitySkipped} skipped`);
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
