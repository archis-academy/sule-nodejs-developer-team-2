import prisma from '../config/db';
import {
  CreateExpenseDto,
  splitMembersType,
} from '../dto/expense/create.expense';

class ExpenseModel {
  async createExpense(
    teamId: string,
    userId: string,
    data: Omit<CreateExpenseDto, 'splitMembers'>,
    splitMembers: splitMembersType
  ) {
    const { categoryId, ...rest } = data;
    return await prisma.expense.create({
      data: {
        teamId,
        paidBy: userId,
        expenseCategoryId: categoryId,
        ...rest,
        expenseSplits: {
          create: splitMembers.map((member) => ({
            userId: member.userId,
            amount: member.amount,
          })),
        },
      },
    });
  }
}

const expenseModel = new ExpenseModel();
export default expenseModel;
