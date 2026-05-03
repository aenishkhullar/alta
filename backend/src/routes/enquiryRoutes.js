import express from 'express'
import {
  generateQuotation,
  submitContact,
  getAllEnquiries,
  getEnquiry,
  updateStatus,
  deleteEnquiry
} from '../controllers/enquiryController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/generate-quotation', generateQuotation)
router.post('/contact', submitContact)

// Admin only routes
router.get('/all', protect, restrictTo('admin'), getAllEnquiries)
router.get('/:id', protect, restrictTo('admin'), getEnquiry)
router.patch('/:id/status', protect, restrictTo('admin'), updateStatus)
router.delete('/:id', protect, restrictTo('admin'), deleteEnquiry)

export default router
