require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Expert = require('../models/Expert');
const connectDB = require('../config/db');

const experts = [
  {
    name: 'Dr. Arjun Mehta',
    category: 'Technology',
    experience: 12,
    rating: 4.9,
    bio: 'Senior software architect specializing in distributed systems and cloud-native applications. Former tech lead at Google with expertise in system design and microservices.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    availableSlots: [
      { date: '2026-05-12', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { date: '2026-05-13', slots: ['09:00 AM', '10:00 AM', '01:00 PM', '04:00 PM'] },
      { date: '2026-05-14', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '05:00 PM'] },
    ],
  },
  {
    name: 'Priya Sharma',
    category: 'Business',
    experience: 8,
    rating: 4.7,
    bio: 'Business strategy consultant with a track record of helping startups scale from seed to Series B. MBA from IIM Ahmedabad with expertise in market analysis and go-to-market strategies.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    availableSlots: [
      { date: '2026-05-12', slots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'] },
      { date: '2026-05-13', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
      { date: '2026-05-15', slots: ['09:00 AM', '10:00 AM', '01:00 PM', '02:00 PM'] },
    ],
  },
  {
    name: 'Rahul Verma',
    category: 'Design',
    experience: 6,
    rating: 4.8,
    bio: 'Award-winning UI/UX designer with experience at top design agencies. Specializes in design systems, user research, and creating delightful digital experiences.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    availableSlots: [
      { date: '2026-05-12', slots: ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'] },
      { date: '2026-05-14', slots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'] },
      { date: '2026-05-16', slots: ['09:00 AM', '11:00 AM', '02:00 PM'] },
    ],
  },
  {
    name: 'Dr. Sneha Patel',
    category: 'Health',
    experience: 15,
    rating: 4.9,
    bio: 'Board-certified wellness coach and nutritionist. Helps professionals optimize their health, manage stress, and build sustainable wellness routines.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    availableSlots: [
      { date: '2026-05-12', slots: ['08:00 AM', '09:00 AM', '11:00 AM', '02:00 PM'] },
      { date: '2026-05-13', slots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'] },
      { date: '2026-05-14', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM'] },
    ],
  },
  {
    name: 'Vikram Singh',
    category: 'Technology',
    experience: 10,
    rating: 4.6,
    bio: 'Full-stack developer and DevOps specialist. Expert in React, Node.js, AWS, and CI/CD pipelines. Passionate about mentoring junior developers.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    availableSlots: [
      { date: '2026-05-13', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'] },
      { date: '2026-05-14', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
      { date: '2026-05-15', slots: ['09:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '04:00 PM'] },
    ],
  },
  {
    name: 'Ananya Gupta',
    category: 'Marketing',
    experience: 7,
    rating: 4.5,
    bio: 'Digital marketing strategist specializing in growth hacking, SEO, and social media marketing. Has helped 50+ brands achieve 3x revenue growth.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    availableSlots: [
      { date: '2026-05-12', slots: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '04:00 PM'] },
      { date: '2026-05-14', slots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { date: '2026-05-16', slots: ['10:00 AM', '11:00 AM', '01:00 PM'] },
    ],
  },
  {
    name: 'Karthik Iyer',
    category: 'Finance',
    experience: 11,
    rating: 4.8,
    bio: 'Certified financial planner and investment advisor. Specializes in personal finance, tax planning, and portfolio management for high-net-worth individuals.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
    availableSlots: [
      { date: '2026-05-12', slots: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'] },
      { date: '2026-05-13', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
      { date: '2026-05-15', slots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'] },
    ],
  },
  {
    name: 'Meera Nair',
    category: 'Design',
    experience: 9,
    rating: 4.7,
    bio: 'Product designer focused on accessibility and inclusive design. Led design teams at Flipkart and Swiggy. Expert in Figma, design thinking, and user testing.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
    availableSlots: [
      { date: '2026-05-13', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'] },
      { date: '2026-05-14', slots: ['10:00 AM', '01:00 PM', '03:00 PM', '04:00 PM'] },
      { date: '2026-05-16', slots: ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'] },
    ],
  },
  {
    name: 'Aditya Kumar',
    category: 'Technology',
    experience: 5,
    rating: 4.4,
    bio: 'Mobile app developer with deep expertise in React Native and Flutter. Has built and launched 20+ apps on both App Store and Google Play.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
    availableSlots: [
      { date: '2026-05-12', slots: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'] },
      { date: '2026-05-15', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
      { date: '2026-05-16', slots: ['09:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'] },
    ],
  },
  {
    name: 'Dr. Ritu Kapoor',
    category: 'Health',
    experience: 18,
    rating: 5.0,
    bio: 'Clinical psychologist and mindfulness coach. Specializes in cognitive behavioral therapy, stress management, and work-life balance for corporate professionals.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ritu',
    availableSlots: [
      { date: '2026-05-12', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { date: '2026-05-13', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM'] },
      { date: '2026-05-14', slots: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '05:00 PM'] },
    ],
  },
  {
    name: 'Sanjay Deshmukh',
    category: 'Business',
    experience: 14,
    rating: 4.6,
    bio: 'Serial entrepreneur and venture consultant. Has co-founded 3 successful startups and advises early-stage companies on product-market fit and fundraising.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay',
    availableSlots: [
      { date: '2026-05-13', slots: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'] },
      { date: '2026-05-14', slots: ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM'] },
      { date: '2026-05-15', slots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'] },
    ],
  },
  {
    name: 'Neha Agarwal',
    category: 'Marketing',
    experience: 6,
    rating: 4.3,
    bio: 'Content marketing expert and brand storyteller. Specializes in content strategy, copywriting, and building brand narratives that convert.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
    availableSlots: [
      { date: '2026-05-12', slots: ['09:00 AM', '11:00 AM', '01:00 PM', '04:00 PM'] },
      { date: '2026-05-14', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '05:00 PM'] },
      { date: '2026-05-16', slots: ['09:00 AM', '10:00 AM', '01:00 PM', '02:00 PM'] },
    ],
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Expert.deleteMany({});
    console.log('Cleared existing experts');

    await Expert.insertMany(experts);
    console.log(`Seeded ${experts.length} experts successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
