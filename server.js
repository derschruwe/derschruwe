const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Cloud project is running');
});

app.get('/info', (req, res) => {
  res.json({ status: 'ok', variant: process.env.STUDENT_VARIANT || 'not-set' });
});

app.get('/books', (req, res) => {
  res.json([
    { id: 1, title: 'Абай жолы' },
    { id: 2, title: 'Қан мен тер' },
    { id: 3, title: 'Көшпенділер' }
  ]);
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));