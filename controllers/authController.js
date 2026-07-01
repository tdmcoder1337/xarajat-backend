const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email va parol kiritilishi shart' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Parol kamida 6 ta belgi bo\'lishi kerak' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name: name || '' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email va parol kiritilishi shart' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const me = async (req, res) => {
  try {
    if (!req.userId.startsWith('user_')) {
      return res.status(401).json({ error: 'Ro\'yxatdan o\'tgan foydalanuvchi emas' });
    }
    const userId = req.userId.replace('user_', '');
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error('[me]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

module.exports = { register, login, me };
