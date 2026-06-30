const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', ctrl.getAll);
router.get('/daily', ctrl.getDailySummary);
router.get('/monthly', ctrl.getMonthlySummary);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;
