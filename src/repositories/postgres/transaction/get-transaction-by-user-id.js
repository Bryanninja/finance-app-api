import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresGetTransactionsByUserId {
  async execute(userId) {
    const transactions = await PostgresHelper.query(
      'SELECT * FROM transaction WHERE id = $1',
      [userId],
    );
    return transactions;
  }
}
