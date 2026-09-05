import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionsByUserId,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js';
import {
  CreateTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase,
} from '../../use-cases/index.js';
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
} from '../../controllers/index.js';

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
