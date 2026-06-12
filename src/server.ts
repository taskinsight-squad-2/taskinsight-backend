import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDatabase from './config/database.config.js';
import router from './routes/index.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Task Insight API' });
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });
