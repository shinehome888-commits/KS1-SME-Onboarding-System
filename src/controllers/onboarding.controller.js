// STEP 4 – Final Submission
const submitOnboarding = async (req, res) => {
  try {
    const { smeId } = req.body;
    const profile = await SMEProfile.findById(smeId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Update status to pending verification
    profile.status = 'PENDING_KYC_VERIFICATION';
    await profile.save();

    // 🔥 TEMPORARY: Replace Kafka with console log for MVP
    // In production, restore Kafka producer.send(...) after setting up Upstash or self-hosted Kafka
    console.log('✅ ONBOARDING SUBMITTED – Forwarding to KS1 Verification System');
    console.log('SME ID:', profile._id);
    console.log('Business:', profile.businessName);
    console.log('Status:', profile.status);

    // Optional: Simulate success response to frontend
    res.json({ 
      success: true, 
      message: 'Onboarding submitted successfully. Awaiting KYC verification.',
      smeId: profile._id,
      status: profile.status
    });
  } catch (err) {
    console.error('❌ Onboarding submission failed:', err.message);
    res.status(500).json({ message: 'Failed to submit onboarding. Please try again.' });
  }
};
