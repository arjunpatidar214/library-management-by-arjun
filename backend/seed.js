const mongoose = require('mongoose');
require('dotenv').config();

const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, MONGO_URI } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding');
  }

  await mongoose.connect(MONGO_URI || 'mongodb://127.0.0.1:27017/librarydb');
  const User = require('./models/User');
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log('Admin account already exists; no changes made.');
    return;
  }

  await User.create({
    name: ADMIN_NAME || 'Library Admin',
    email,
    password: ADMIN_PASSWORD,
    role: 'admin'
  });
  console.log(`Admin account created for ${email}`);
};

seedAdmin()
  .catch(err => {
    console.error('Admin seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
