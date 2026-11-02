const express = require('express');
const { Pool } = require('pg'); // Подключение библиотеки для PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка подключения к базе данных
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json()); // Позволяет серверу читать JSON из тела запроса

// Вспомогательный endpoint для создания таблицы и 3 начальных записей[cite: 6]
app.get('/api/init', async (req, res) => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS books (id SERIAL PRIMARY KEY, title VARCHAR(100), author VARCHAR(100))');
    await pool.query(`INSERT INTO books (title, author) VALUES 
      ('Абай жолы', 'Мұхтар Әуезов'), 
      ('Қан мен тер', 'Әбдіжәміл Нұрпейісов'), 
      ('Көшпенділер', 'Ілияс Есенберлин') 
      ON CONFLICT DO NOTHING`);
    res.send('Таблица создана и в нее добавлено 3 записи');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET: Оқу всех записей
app.get('/api/books', async (req, res) => {
  const r = await pool.query('SELECT * FROM books ORDER BY id');
  res.json(r.rows);
});

// GET: Оқу одной записи по id (используется параметризованный SQL-запрос $1)
app.get('/api/books/:id', async (req, res) => {
  const r = await pool.query('SELECT * FROM books WHERE id=$1', [req.params.id]);
  res.json(r.rows[0] || null);
});

// POST: Қосу новой записи (используется параметризованный SQL-запрос $1, $2)[cite: 5, 6]
app.post('/api/books', async (req, res) => {
  const { title, author } = req.body;
  const r = await pool.query(
    'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *', 
    [title, author]
  );
  res.status(201).json(r.rows[0]);
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));