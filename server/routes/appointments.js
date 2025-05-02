const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Client = require('../models/Client');
const Service = require('../models/Service');
const { sendWhatsAppNotification } = require('../utils/notifications');

// Create new appointment
router.post('/', async (req, res) => {
  try {
    // Find or create client
    let client = await Client.findOne({ phone: req.body.phone });
    
    if (!client) {
      // Create new client if doesn't exist
      client = new Client({
        phone: req.body.phone,
        name: req.body.name
      });
      await client.save();
    }
    
    // Calculate total price and duration
    const services = await Service.find({
      _id: { $in: req.body.services }
    });
    
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    
    // Calculate total duration in minutes for simplicity
    const durationParts = services.map(service => {
      const [value, unit] = service.duration.split(' ');
      return unit === 'h' ? parseInt(value) * 60 : parseInt(value);
    });
    
    const totalMinutes = durationParts.reduce((sum, minutes) => sum + minutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalDuration = `${hours}h ${minutes}m`;
    
    // Create appointment
    const appointment = new Appointment({
      client: client._id,
      services: req.body.services,
      date: req.body.date,
      time: req.body.time,
      totalPrice,
      totalDuration
    });
    
    const newAppointment = await appointment.save();
    
    // Populate for WhatsApp notification
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('client')
      .populate('services');
    
    // Send WhatsApp notification to admin
    await sendWhatsAppNotification(populatedAppointment);
    
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Get available time slots for a specific date
router.get('/available-slots/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    
    // Get all appointments for the selected date
    const appointments = await Appointment.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59))
      }
    });
    
    // Define available time slots (you can adjust these)
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
                      '18:00', '18:30', '19:00'];
    
    // Filter out booked time slots
    const bookedSlots = appointments.map(app => app.time);
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;