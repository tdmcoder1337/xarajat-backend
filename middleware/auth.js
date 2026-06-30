const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const guestId = req.headers['x-guest-id'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = `user_${decoded.userId}`;
      return next();
    } catch {
      return res.status(401).json({ error: 'Token yaroqsiz, qayta kiring' });
    }
  }

  if (guestId && guestId.length > 8) {
    req.userId = `guest_${guestId}`;
    return next();
  }

  res.status(401).json({ error: 'Autentifikatsiya talab qilinadi' });
};
