import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/database.config.js';

const PORT = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Task Insight API' });
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });
