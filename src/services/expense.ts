import {
  CreateExpenseDto,
  splitMembersType,
} from '../dto/expense/create.expense';
import expenseModel from '../models/expense';
import teamService from './team';
import categoryService from './category';
import { AppError } from '../utils/appError';

class ExpenseService {
  async createExpense(teamId: string, userId: string, data: CreateExpenseDto) {
    await teamService.checkTeam(teamId);
    await categoryService.getCategoryById(teamId, data.categoryId);
    let membersToSplitBetween: string[];

    if (data.splitMembers && data.splitMembers.length > 0) {
      membersToSplitBetween = data.splitMembers;
      const teamMembers = await teamService.checkTeamMembers(
        teamId,
        membersToSplitBetween
      );
      if (teamMembers.length !== membersToSplitBetween.length) {
        throw new AppError(
          "Some of the split members don't belong to this team.",
          403
        );
      }
    } else {
      const allTeamMembers = await teamService.getTeamMembers(teamId);
      if (allTeamMembers.length === 0) {
        throw new AppError(
          'Cannot create expense for a team with no members.',
          400
        );
      }
      membersToSplitBetween = allTeamMembers.map((member) => member.User.id);
    }
    const splitMembers: splitMembersType = membersToSplitBetween.map(
      (member) => ({
        userId: member,
        amount: data.amount / membersToSplitBetween.length,
      })
    );
    const { categoryId, amount, title, date, ...rest } = data;
    const expense = await expenseModel.createExpense(
      teamId,
      userId,
      { categoryId, amount, title, date },
      splitMembers
    );
    return expense;
  }
  async getExpenses(
    teamId: string,
    userId: string,
    filters: {
      page: number;
      limit: number;
      category?: string;
      member?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    await teamService.checkTeam(teamId);
    const isMember = await teamService.checkMembership(teamId, userId);
    if (!isMember) {
      throw new AppError(`${userId} is not a member of this team.`, 403);
    }

    return await expenseModel.getExpenses(teamId, filters);
  }
}

const expenseService = new ExpenseService();
export default expenseService;
