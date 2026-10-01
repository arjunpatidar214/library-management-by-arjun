require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  await User.deleteOne({ email: 'admin@library.com' });
  await User.create({
    name: 'Admin',
    email: 'admin@library.com',
    password: 'Admin@123',
    role: 'admin'
  });
  console.log('Admin created!');
  process.exit();
}).catch(err => {
  console.log('Error:', err.message);
  process.exit();
});
