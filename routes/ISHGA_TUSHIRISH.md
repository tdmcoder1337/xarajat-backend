# Xarajat Statistika - Ishga Tushirish

## 1. Backend (server) ishga tushirish

```bash
cd backend
node server.js
```
Server http://localhost:5000 da ishlaydi.

## 2. Frontend (React) ishga tushirish (yangi terminal)

```bash
cd frontend
npm run dev
```
Sayt http://localhost:5173 da ochiladi.

---

## Papka Strukturasi

```
xarajat-statistika/
├── backend/
│   ├── controllers/
│   │   ├── transactionController.js   # Daromad/xarajat logikasi
│   │   └── essentialController.js     # Muhim xarajatlar logikasi
│   ├── routes/
│   │   ├── transactions.js            # /api/transactions yo'llari
│   │   └── essentials.js             # /api/essentials yo'llari
│   ├── db/
│   │   ├── database.js               # SQLite ulanish va jadvallar
│   │   └── data.db                   # Ma'lumotlar fayli (avtomatik yaratiladi)
│   └── server.js                     # Asosiy server fayli
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Sidebar.jsx            # Yon menyu
        │   ├── SummaryCard.jsx        # Statistika kartochkasi
        │   ├── AddTransactionForm.jsx # Yozuv qo'shish formasi
        │   └── TransactionTable.jsx   # Yozuvlar jadvali
        ├── pages/
        │   ├── DailyPage.jsx          # Kunlik sahifa
        │   ├── MonthlyPage.jsx        # Oylik sahifa
        │   ├── EssentialsPage.jsx     # Muhim xarajatlar sahifasi
        │   └── TransactionsPage.jsx   # Barcha yozuvlar sahifasi
        ├── services/
        │   └── api.js                 # Backend bilan bog'lanish
        └── styles/
            └── global.css             # Barcha stillar
```
