import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({

  // CORE CLIENT DETAILS
  clientName: { type: String, required: true },
  businessName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  businessType: { type: String, default: '' },
  websiteLink: { type: String, default: '' },
  socialLinks: { type: String, default: '' },
  preferredContact: { 
    type: String, 
    enum: ['Email', 'WhatsApp', 'Call', 'Instagram', 'LinkedIn', ''],
    default: '' 
  },
  timezone: { type: String, default: '' },
  leadSource: { 
    type: String, 
    enum: ['Instagram', 'LinkedIn', 'Referral', 'Website', 'Cold Outreach', 'Other', ''],
    default: '' 
  },

  // PROJECT INFORMATION
  projectType: { 
    type: String, 
    enum: ['Landing Page', 'Business Website', 'Web App', 'Redesign', 'Speed Optimization', ''],
    default: '' 
  },
  projectStage: { 
    type: String,
    enum: ['Lead', 'Discovery', 'Proposal', 'Onboarding', 'In Progress', 'Review', 'Delivered', 'Maintenance', 'Closed', ''],
    default: 'Lead'
  },
  startDate: { type: Date, default: null },
  targetDeliveryDate: { type: Date, default: null },
  priorityLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent', ''],
    default: 'Medium' 
  },
  budgetRange: { type: String, default: '' },
  packageChosen: { type: String, default: '' },
  addOnsSelected: { type: String, default: '' },

  // COMMUNICATION TRACKING
  lastCallDate: { type: Date, default: null },
  lastMessageDate: { type: Date, default: null },
  lastEmailDate: { type: Date, default: null },
  whoSpokeLast: { type: String, default: '' },
  whatWasDiscussed: { type: String, default: '' },
  didTheyReply: { type: Boolean, default: false },
  nextFollowUpDate: { type: Date, default: null },
  followUpStatus: { 
    type: String, 
    enum: ['Pending', 'Sent', 'Replied', 'Delayed', ''],
    default: 'Pending' 
  },

  // WORKFLOW STATUS — all Boolean checkboxes
  discoveryCallDone: { type: Boolean, default: false },
  proposalSent: { type: Boolean, default: false },
  proposalApproved: { type: Boolean, default: false },
  onboardingCallDone: { type: Boolean, default: false },
  triggerFormCompleted: { type: Boolean, default: false },
  contractSigned: { type: Boolean, default: false },
  invoicePaid: { type: Boolean, default: false },
  groupChatCreated: { type: Boolean, default: false },
  firstDeliverySent: { type: Boolean, default: false },
  feedbackReceived: { type: Boolean, default: false },
  revisionsPending: { type: Boolean, default: false },
  finalDeliveryDone: { type: Boolean, default: false },
  maintenanceOngoing: { type: Boolean, default: false },

  // ASSETS AND ACCESS — all Boolean checkboxes
  logoReceived: { type: Boolean, default: false },
  brandColorsReceived: { type: Boolean, default: false },
  fontsReceived: { type: Boolean, default: false },
  contentReceived: { type: Boolean, default: false },
  imagesReceived: { type: Boolean, default: false },
  videosReceived: { type: Boolean, default: false },
  hostingAccessReceived: { type: Boolean, default: false },
  domainAccessReceived: { type: Boolean, default: false },
  githubAccessReceived: { type: Boolean, default: false },
  figmaAccessReceived: { type: Boolean, default: false },
  adminPanelAccessReceived: { type: Boolean, default: false },

  // TASKS AND NOTES
  todoList: [{
    task: { type: String, required: true },
    assignedTo: { type: String, default: 'Aenish' },
    deadline: { type: Date, default: null },
    status: { 
      type: String, 
      enum: ['Pending', 'In Progress', 'Done', 'Blocked'],
      default: 'Pending' 
    }
  }],
  internalNotes: { type: String, default: '' },
  clientNotes: { type: String, default: '' },
  blockers: { type: String, default: '' },
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', ''],
    default: 'Low' 
  },
  waitingOn: { 
    type: String, 
    enum: ['Client', 'Team', 'Neither', ''],
    default: 'Neither' 
  },

  // FINANCIAL TRACKING
  totalProjectValue: { type: Number, default: 0 },
  advanceReceived: { type: Number, default: 0 },
  balancePending: { type: Number, default: 0 },
  invoiceStatus: { 
    type: String, 
    enum: ['Not Sent', 'Sent', 'Partially Paid', 'Paid', 'Overdue', ''],
    default: 'Not Sent' 
  },
  paymentDueDate: { type: Date, default: null },
  paymentMethod: { 
    type: String, 
    enum: ['UPI', 'Bank Transfer', 'PayPal', 'Razorpay', 'Cash', 'Other', ''],
    default: '' 
  },
  revisionPolicyAccepted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

clientSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

export default mongoose.model('Client', clientSchema);
