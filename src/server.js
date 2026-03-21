const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware: Verify token via Central Auth
async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });

  try {
    const response = await fetch('https://ks1-central-auth.onrender.com/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await response.json();
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification failed:', err);
    res.status(500).json({ error: 'Auth service unavailable' });
  }
}

// Protect all API routes
app.use('/api', authenticateToken);

// Your existing onboarding routes go here
// Example:
app.post('/api/onboarding/create-sme-profile', (req, res) => {
  // Use req.user.user_id and req.user.trade_id
  res.json({ success: true, smeId: req.user.trade_id });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ KS1 SME Onboarding running on port ${PORT}`);
});
