const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.cookies['access-token'];

  // 🚫 If token is missing
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access - token not found' });
  }

  // ✅ Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access - invalid token' });
    }

    req.user = decoded; // add decoded user info (like email) to request
    next(); // move to the next middleware/route
  });
};

module.exports = verifyJWT;
