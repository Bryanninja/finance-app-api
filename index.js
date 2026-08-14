import 'dotenv/config.js';
import express from 'express';
const app = express();

import { PostgresHelper } from './src/db/postgres/helper.js';

app.get('/', async (req, res) => {
  const results = await PostgresHelper.query('SELECT * FROM users;');
  res.send(JSON.stringify(results));
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
