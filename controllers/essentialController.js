const EssentialExpense = require('../models/EssentialExpense');

const getAll = async (req, res) => {
  try {
    const rows = await EssentialExpense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const create = async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ error: 'Nom va miqdor kiritilishi shart' });
    }
    const item = await EssentialExpense.create({
      userId: req.userId,
      name,
      amount: parseFloat(amount),
    });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body;
    const item = await EssentialExpense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        ...(name && { name }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
      },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Topilmadi' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await EssentialExpense.findOneAndDelete({ _id: id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ message: 'O\'chirildi' });
  } catch {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

module.exports = { getAll, create, update, remove };
