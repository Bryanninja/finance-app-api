import z from 'zod';

export const createUserSchema = z.object({
  first_name: z
    .string({
      error: 'First name is required.',
    })
    .trim()
    .min(1),
  last_name: z
    .string({
      error: 'Last name is required.',
    })
    .trim()
    .min(1),
  email: z
    .email({
      error: 'Please provided a valid E-mail.',
    })
    .trim()
    .min(1, {
      error: 'Email is required.',
    }),
  password: z
    .string({
      error: 'Password is required.',
    })
    .trim()
    .min(6, {
      error: 'Password must have at least 6 characters.',
    }),
});

export const updateUserSchema = createUserSchema.partial().strict();
