import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import expenseService from '../services/expense';
import { CreateExpenseDto } from '../dto/expense/create.expense';

class ExpenseController {
  async createExpense(
    req: Request<{ id: string }, Record<string, never>, CreateExpenseDto>,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const expense = await expenseService.createExpense(id, userId, req.body);
      res.status(201).json(expense);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async getExpenses(
    req: Request<
      { id: string },
      Record<string, never>,
      Record<string, never>,
      {
        page?: string;
        limit?: string;
        category?: string;
        member?: string;
        startDate?: string;
        endDate?: string;
      }
    >,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const query = req.query;

      const expenses = await expenseService.getExpenses(id, userId, {
        page: query.page ? parseInt(query.page) : 1,
        limit: query.limit ? parseInt(query.limit) : 10,
        category: query.category,
        member: query.member,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      });

      res.status(200).json(expenses);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}

const expenseController = new ExpenseController();
export default expenseController;
