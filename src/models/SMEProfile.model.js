const mongoose = require('mongoose');

const SMEProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  smeId: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  industry: String,
  country: { type: String, default: 'Ghana' },
  city: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('SMEProfile', SMEProfileSchema);
