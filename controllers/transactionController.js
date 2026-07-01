const Transaction = require('../models/Transaction');

const getAll = async (req, res) => {
  try {
    const { date, month, year } = req.query;
    const filter = { userId: req.userId };

    if (date) {
      filter.date = date;
    } else if (month && year) {
      const m = String(month).padStart(2, '0');
      filter.date = { $regex: `^${year}-${m}` };
    }

    const rows = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(rows);
  } catch (err) {
    console.error('[transactions getAll]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const rows = await Transaction.find({ userId: req.userId, date: targetDate });
    const income = rows.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const expense = rows.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

    res.json({ date: targetDate, income, expense, net: income - expense });
  } catch (err) {
    console.error('[transactions getDailySummary]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    const rows = await Transaction.find({
      userId: req.userId,
      date: { $regex: `^${monthStr}` },
    });

    const income = rows.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const expense = rows.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const daysInMonth = new Date(year, month, 0).getDate();

    res.json({
      month: monthStr,
      income,
      expense,
      net: income - expense,
      dailyAvgIncome: daysInMonth > 0 ? income / daysInMonth : 0,
      daysInMonth,
    });
  } catch (err) {
    console.error('[transactions getMonthlySummary]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const create = async (req, res) => {
  try {
    const { type, amount, description, date } = req.body;
    if (!type || !amount || !description || !date) {
      return res.status(400).json({ error: 'Barcha maydonlar to\'ldirilishi shart' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Tur: income yoki expense bo\'lishi kerak' });
    }
    const tx = await Transaction.create({
      userId: req.userId,
      type,
      amount: parseFloat(amount),
      description,
      date,
    });
    res.status(201).json(tx);
  } catch (err) {
    console.error('[transactions create]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date } = req.body;
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Tur: income yoki expense bo\'lishi kerak' });
    }
    const tx = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { ...(type && { type }), ...(amount && { amount: parseFloat(amount) }), ...(description && { description }), ...(date && { date }) },
      { new: true }
    );
    if (!tx) return res.status(404).json({ error: 'Topilmadi' });
    res.json(tx);
  } catch (err) {
    console.error('[transactions update]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findOneAndDelete({ _id: id, userId: req.userId });
    if (!tx) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ message: 'O\'chirildi' });
  } catch (err) {
    console.error('[transactions remove]', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

module.exports = { getAll, getDailySummary, getMonthlySummary, create, update, remove };
