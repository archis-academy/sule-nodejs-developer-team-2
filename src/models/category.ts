import prisma from '../config/db';
import { CreateCategoryDto } from '../dto/category/create.category';
import { UpdateCategoryDto } from '../dto/category/update.category';

class CategoryModel {
  async createCategory(teamId: string, data: CreateCategoryDto) {
    return await prisma.expenseCategory.create({
      data: {
        teamId,
        name: data.name,
      },
    });
  }
  async getTeamCategories(teamId: string) {
    return await prisma.expenseCategory.findMany({
      where: {
        teamId,
      },
    });
  }
  async getCategoryById(teamId: string, categoryId: string) {
    return await prisma.expenseCategory.findFirst({
      where: {
        id: categoryId,
        teamId,
      },
    });
  }
  async getCategoryByName(teamId: string, categoryName: string) {
    return await prisma.expenseCategory.findUnique({
      where: { teamId_name: { teamId, name: categoryName } },
    });
  }
  async updateCategory(
    teamId: string,
    categoryId: string,
    data: UpdateCategoryDto
  ) {
    return await prisma.expenseCategory.update({
      where: {
        id: categoryId,
        teamId,
      },
      data: {
        name: data.name,
      },
    });
  }
  async deleteCategory(teamId: string, categoryId: string) {
    return await prisma.expenseCategory.delete({
      where: {
        id: categoryId,
        teamId,
      },
    });
  }
}

const categoryModel = new CategoryModel();
export default categoryModel;
