import Enquiry from '../models/Enquiry.js'
import { generateQuotationNumber } from '../utils/generateQuotation.js'

// POST /api/enquiry/generate-quotation
// Called when user clicks "Get a Quote" in ServicesPage
// Saves cart snapshot and returns quotation number
export const generateQuotation = async (req, res) => {
  try {
    const {
      cartItems,        // array of cart items
      subtotal,
      discount,
      coupon,
      gst,
      total
    } = req.body

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'No services selected.'
      })
    }

    const quotationNumber = generateQuotationNumber()

    // Save partial enquiry — contact details added later
    const enquiry = await Enquiry.create({
      name: 'PENDING',
      email: 'PENDING',
      phone: '',
      projectDetails: 'PENDING',
      budget: '',
      quotationNumber,
      quotationItems: cartItems,
      quotationSubtotal: subtotal,
      quotationDiscount: discount,
      quotationCoupon: coupon || '',
      quotationGST: gst,
      quotationTotal: total,
      status: 'new'
    })

    res.status(201).json({
      status: 'success',
      quotationNumber: enquiry.quotationNumber
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// POST /api/enquiry/contact
// Called on contact form submit — updates existing enquiry
// with client contact details
export const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      projectDetails,
      budget,
      quotationNumber
    } = req.body

    if (!quotationNumber) {
      return res.status(400).json({
        status: 'fail',
        message: 'Quotation number is required.'
      })
    }

    // Find the existing quotation record
    const enquiry = await Enquiry.findOne({ quotationNumber })

    if (!enquiry) {
      return res.status(404).json({
        message: 'Quotation not found. Please generate a quotation from the Services page first.'
      })
    }

    if (enquiry.name !== 'PENDING') {
      return res.status(400).json({
        message: 'This quotation has already been submitted.'
      })
    }

    // Update with contact details
    enquiry.name = name
    enquiry.email = email
    enquiry.phone = phone || ''
    enquiry.projectDetails = projectDetails
    enquiry.budget = budget || ''
    await enquiry.save()

    res.status(200).json({
      success: true,
      message: 'Enquiry submitted successfully.'
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// GET /api/enquiry/all — Admin only
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({})
      .sort({ createdAt: -1 })
    res.status(200).json({ status: 'success', data: enquiries })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// GET /api/enquiry/:id — Admin only
export const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) return res.status(404).json({ status: 'fail', message: 'Not found' })
    res.status(200).json({ status: 'success', data: enquiry })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// PATCH /api/enquiry/:id/status — Admin only
export const updateStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    )
    if (!enquiry) return res.status(404).json({ status: 'fail', message: 'Not found' })
    res.status(200).json({ status: 'success', data: enquiry })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// DELETE /api/enquiry/:id — Admin only
export const deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}
