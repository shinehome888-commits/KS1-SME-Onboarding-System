const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
require('./config/db');

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['https://ks1-alkebulan-pay.pages.dev', /\.pages\.dev$/],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/onboarding', require('./routes/onboarding.routes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'KS1 SME Onboarding', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 10001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KS1 ONBOARDING] Running on port ${PORT}`);
});
