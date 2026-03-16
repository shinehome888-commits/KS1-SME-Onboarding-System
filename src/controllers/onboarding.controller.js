const User = require('../models/User.model');
const SMEProfile = require('../models/SMEProfile.model');

// 🔑 Generate KS1-style SME ID (e.g., KS1-T5WQ)
const generateSmeId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'KS1-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Step 1: Create user account
const createAccount = async (req, res) => {
  try {
    const { fullName, phone, wallet, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: 'Full name, phone, and password are required' });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    const user = new User({ fullName, phone, wallet, password });
    await user.save();

    res.json({ success: true, userId: user._id.toString() });
  } catch (err) {
    console.error('Create Account Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Step 2: Create SME profile + generate KS1 ID
const createSMEProfile = async (req, res) => {
  try {
    const { userId, businessName, businessType, industry, country, city, address } = req.body;

    if (!userId || !businessName || !businessType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 🔥 Generate real KS1 SME ID
    const smeId = generateSmeId(); // e.g., "KS1-T5WQ"

    const smeProfile = new SMEProfile({
      userId,
      smeId,
      businessName,
      businessType,
      industry,
      country,
      city,
      address
    });

    await smeProfile.save();

    res.json({ success: true, smeId });
  } catch (err) {
    console.error('Create SME Profile Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Step 3: Upload document
const uploadDocument = async (req, res) => {
  try {
    const { smeId, documentType } = req.body;
    const file = req.file;

    if (!smeId || !file) {
      return res.status(400).json({ message: 'smeId and document are required' });
    }

    // In real app: save to cloud storage and return URL
    const documentUrl = 'https://example.com/uploaded-id.jpg';

    res.json({ success: true, documentUrl });
  } catch (err) {
    console.error('Upload Document Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Step 4: Finalize onboarding and trigger KYC
const submitOnboarding = async (req, res) => {
  try {
    const { smeId } = req.body;

    if (!smeId) {
      return res.status(400).json({ message: 'smeId is required' });
    }

    const sme = await SMEProfile.findOne({ smeId });
    if (!sme) {
      return res.status(404).json({ message: 'SME not found' });
    }

    console.log('✅ ONBOARDING SUBMITTED – Forwarding to KS1 Verification System');
    console.log('SME ID:', smeId);
    console.log('Business:', sme.businessName);
    console.log('Status: PENDING_KYC_VERIFICATION');

    // Call KYC system
    const kycRes = await fetch('https://ks1-verification-kyc-system-2.onrender.com/api/kyc/start-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        smeId: sme.smeId, // 👈 Now it's KS1-XXXX, not ObjectId
        businessName: sme.businessName,
        ownerName: sme.ownerName || 'N/A',
        idType: 'Ghana Card',
        idNumber: 'GHA123456789',
        documentUrls: ['https://example.com/id.jpg'],
        city: sme.city
      })
    });

    const kycResult = await kycRes.json();

    res.json({ success: true, kycStatus: kycResult.status });
  } catch (err) {
    console.error('Submit Onboarding Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAccount,
  createSMEProfile,
  uploadDocument,
  submitOnboarding
};
