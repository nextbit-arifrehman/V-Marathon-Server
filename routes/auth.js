const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create JWT and set in cookie
router.post('/jwt', (req, res) => {
  const user = req.body; // expect: { email }
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('access-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000
  }).send({ success: true });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('access-token', {
    secure: true,
    sameSite: 'None'
  }).send({ success: true });
});

module.exports = router;
