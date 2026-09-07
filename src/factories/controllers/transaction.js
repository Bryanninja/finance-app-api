import {
  PostgresCreateTransactionRepository,
  PostgresDeleteTransactionRepository,
  PostgresGetTransactionsByUserId,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js';
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase,
} from '../../use-cases/index.js';
import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
} from '../../controllers/index.js';
import { PostgresGetTransactionByIdRepository } from '../../repositories/postgres/transaction/get-transaction-by-id.js';

export const makeTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();

  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  );

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  );

  return createTransactionController;
};

export const makeGetTransactionByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserId();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionsByUserIdRepository,
    getUserByIdRepository,
  );

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

  return getTransactionsByUserIdController;
};

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  );

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  );

  return updateTransactionController;
};

export const makeDeleteTransactionController = () => {
  const getTransactionById = new PostgresGetTransactionByIdRepository();
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
    getTransactionById,
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  );
  return deleteTransactionController;
};
