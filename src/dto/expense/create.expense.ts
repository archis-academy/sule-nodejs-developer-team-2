import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Expense title cannot be empty')
    .max(50, 'Expense title must be less than 50 characters.'),
  amount: z
    .number('Expense amount must be a number.')
    .min(1, 'Expense amount cannot be empty.')
    .positive('Expense amount must be greater than 0.'),
  date: z.coerce
    .date()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const now = new Date();
      if (new Date(date) > now) {
        return false;
      }
      return true;
    }, 'Expense date cannot be in the future.'),
  categoryId: z.uuid('Expense category id must be a valid UUID.'),
  splitMembers: z
    .array(z.uuid('Expense split member id must be a valid UUID.'))
    .min(1, 'Expense split member id cannot be empty.')
    .optional()
    .refine((members) => {
      if (!members) return true;
      const uniqueMembers = new Set(members);
      return uniqueMembers.size === members.length;
    }, 'Duplicate split members are not allowed.'),
});

interface splitMember {
  userId: string;
  amount: number;
}

export type splitMembersType = splitMember[];

export type CreateExpenseDto = z.infer<typeof CreateExpenseSchema>;
