import express from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin'), getAllClients);
router.post('/', protect, restrictTo('admin'), createClient);
router.get('/:id', protect, restrictTo('admin'), getClientById);
router.put('/:id', protect, restrictTo('admin'), updateClient);
router.delete('/:id', protect, restrictTo('admin'), deleteClient);

export default router;
