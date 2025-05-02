const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Service = require('../models/Service');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Create admin user
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        password: 'admin123' // This will be hashed by the pre-save hook
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample services
    const services = [
      {
        name: 'Corte y peinado',
        price: 80,
        duration: '45 m'
      },
      {
        name: 'Balayage',
        price: 175,
        duration: '2 h'
      },
      {
        name: 'Extensiones',
        price: 200,
        duration: '1 h 30 m'
      },
      {
        name: 'Barba',
        price: 40,
        duration: '20 m'
      },
      {
        name: 'Ozonoterapia capilar',
        price: 35000,
        duration: '1 h 30 m'
      }
    ];

    // Check if services exist
    const servicesCount = await Service.countDocuments();
    
    if (servicesCount === 0) {
      await Service.insertMany(services);
      console.log('Sample services created');
    } else {
      console.log('Services already exist');
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();