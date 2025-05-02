const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Get client by phone number
router.get('/:phone', async (req, res) => {
  try {
    const client = await Client.findOne({ phone: req.params.phone });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new client
router.post('/', async (req, res) => {
  const client = new Client({
    phone: req.body.phone,
    name: req.body.name
  });

  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
