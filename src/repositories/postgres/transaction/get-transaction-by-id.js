import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresGetTransactionByIdRepository {
  async execute(transactionId) {
    const transaction = await PostgresHelper.query(
      'SELECT * FROM transactions WHERE id = $1 RETURNING *',
      [transactionId],
    );
    return transaction[0];
  }
}
