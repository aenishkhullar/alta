import Client from '../models/Client.js';

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    console.error('Error in getAllClients:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error', stack: error.stack });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error('Error in getClientById:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error', stack: error.stack });
  }
};

export const createClient = async (req, res) => {
  try {
    const { clientName } = req.body;
    if (!clientName) {
      return res.status(400).json({ success: false, message: 'clientName is required' });
    }
    const newClient = await Client.create(req.body);
    res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    console.error('Error in createClient:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error', stack: error.stack });
  }
};

export const updateClient = async (req, res) => {
  try {
    // Manually setting updatedAt
    const updateData = { ...req.body, updatedAt: Date.now() };
    const client = await Client.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error('Error in updateClient:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error', stack: error.stack });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, message: 'Client deleted' });
  } catch (error) {
    console.error('Error in deleteClient:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error', stack: error.stack });
  }
};
