import z from 'zod';
import validator from 'validator';

export const createTransactionSchema = z.object({
  user_id: z.uuid({
    error: 'User ID must be a valid UUID.',
  }),
  name: z.string().trim().min(1, {
    error: 'Name is required.',
  }),
  date: z.iso.datetime({
    error: 'Date must be a valid date.',
  }),
  type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
    error: 'Type must be EXPENSE, EARNING or INVESTMENT.',
  }),
  amount: z
    .number({
      error: 'Amount must be a number',
    })
    .min(1, {
      error: 'Amount must be greater than 0.',
    })
    .refine((amount) =>
      validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      }),
    ),
});
