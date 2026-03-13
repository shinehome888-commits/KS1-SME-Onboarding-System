const express = require('express');
const upload = require('../services/fileUpload.service');
const { 
  createAccount, 
  verifyPhone, 
  createSMEProfile, 
  uploadDocument, 
  getSMEProfile, 
  submitOnboarding 
} = require('../controllers/onboarding.controller');

const router = express.Router();

router.post('/create-account', createAccount);
router.post('/verify-phone', verifyPhone);
router.post('/create-sme-profile', createSMEProfile);
router.post('/upload-document', upload.single('document'), uploadDocument);
router.get('/sme-profile/:id', getSMEProfile);
router.post('/submit-onboarding', submitOnboarding);

module.exports = router;
