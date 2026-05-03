import mongoose from 'mongoose'

const EnquirySchema = new mongoose.Schema({
  name: { type: String, default: 'PENDING' },
  email: { type: String, default: 'PENDING' },
  phone: { type: String, default: '' },
  projectDetails: { type: String, default: '' },
  budget: { type: String, default: '' },
  quotationNumber: { type: String, unique: true, required: true },
  quotationItems: [
    {
      serviceId: String,
      serviceName: String,
      pages: Number,
      addons: [String],
      basePrice: Number,
      addonPrice: Number,
      pagePrice: Number,
      lineTotal: Number,
    }
  ],
  quotationSubtotal: { type: Number, default: 0 },
  quotationDiscount: { type: Number, default: 0 },
  quotationCoupon: { type: String, default: '' },
  quotationGST: { type: Number, default: 0 },
  quotationTotal: { type: Number, default: 0 },
  status: { type: String, enum: ['new','read','in-progress','completed','rejected'], default: 'new' },
  adminNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Enquiry', EnquirySchema)
