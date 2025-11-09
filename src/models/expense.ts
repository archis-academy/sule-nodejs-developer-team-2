import prisma from '../config/db';
import {
  CreateExpenseDto,
  splitMembersType,
} from '../dto/expense/create.expense';
import { Prisma } from '@prisma/client';
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
  async getExpenses(
    teamId: string,
    filters: {
      page: number;
      limit: number;
      category?: string;
      member?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const skip = (filters.page - 1) * filters.limit;

    const where: Prisma.ExpenseWhereInput = {
      teamId,
      ...(filters.category && {
        expenseCategoryId: filters.category,
      }),
      ...(filters.member && {
        OR: [
          { paidBy: filters.member },
          { expenseSplits: { some: { userId: filters.member } } },
        ],
      }),
      ...((filters.startDate || filters.endDate) && {
        date: {
          ...(filters.startDate && { gte: filters.startDate }),
          ...(filters.endDate && { lte: filters.endDate }),
        },
      }),
    };

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { date: 'desc' },
        include: {
          Creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ExpenseCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          expenseSplits: {
            include: {
              User: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      data: expenses,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }
}

const expenseModel = new ExpenseModel();
export default expenseModel;
