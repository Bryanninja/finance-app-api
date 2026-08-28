import 'dotenv/config.js';
import express from 'express';

import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from './src/factories/controllers/user.js';
import { makeTransactionController } from './src/factories/controllers/transaction.js';

const app = express();

app.use(express.json());

app.get('/api/users/:userId', async (req, res) => {
  // injeção de dependências no index e usando constructor nas demais!
  // Arquiterura limpa e podemos mudar o banco de dados com facilidade

  const getUserByIdController = makeGetUserByIdController();
  const { statusCode, body } = await getUserByIdController.execute(req);

  res.status(statusCode).json(body);
});

app.post('/api/users', async (req, res) => {
  const createUserController = makeCreateUserController();

  const { statusCode, body } = await createUserController.execute(req);

  res.status(statusCode).json(body);
});

app.patch('/api/users/:userId', async (req, res) => {
  const updateUserController = makeUpdateUserController();

  const { statusCode, body } = await updateUserController.execute(req);

  res.status(statusCode).json(body);
});

app.delete('/api/users/:userId', async (req, res) => {
  const deleteUserController = makeDeleteUserController();
  const { statusCode, body } = await deleteUserController.execute(req);

  res.status(statusCode).json(body);
});

app.post('/api/transactions', async (req, res) => {
  const createTransactionController = makeTransactionController();

  const { statusCode, body } = await createTransactionController.execute(req);
  res.status(statusCode).json(body);
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port http://localhost:${process.env.PORT}`),
);
