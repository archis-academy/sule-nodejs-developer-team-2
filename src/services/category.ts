import { CreateCategoryDto } from '../dto/category/create.category';
import { UpdateCategoryDto } from '../dto/category/update.category';
import categoryModel from '../models/category';
import teamService from './team';
import { AppError } from '../utils/appError';

class CategoryService {
  async getCategoryById(teamId: string, categoryId: string) {
    const category = await categoryModel.getCategoryById(teamId, categoryId);
    if (!category) throw new AppError('Category not found.', 404);
  }
  private async getCategoryByName(
    teamId: string,
    categoryName: string,
    categoryId?: string
  ) {
    const existCategory = await categoryModel.getCategoryByName(
      teamId,
      categoryName
    );
    if (existCategory && (!categoryId || existCategory.id !== categoryId)) {
      throw new AppError('Category already exists.', 409);
    }
  }
  async createCategory(teamId: string, data: CreateCategoryDto) {
    await teamService.checkTeam(teamId);
    await this.getCategoryByName(teamId, data.name);
    const category = await categoryModel.createCategory(teamId, data);
    return category;
  }
  async getTeamCategories(teamId: string) {
    await teamService.checkTeam(teamId);
    const categories = await categoryModel.getTeamCategories(teamId);
    return categories;
  }
  async updateCategory(
    teamId: string,
    categoryId: string,
    data: UpdateCategoryDto
  ) {
    await teamService.checkTeam(teamId);
    await this.getCategoryById(teamId, categoryId);
    await this.getCategoryByName(teamId, data.name, categoryId);
    const updatedCategory = await categoryModel.updateCategory(
      categoryId,
      data
    );
    return updatedCategory;
  }
  async deleteCategory(teamId: string, categoryId: string) {
    await teamService.checkTeam(teamId);
    await this.getCategoryById(teamId, categoryId);
    const deletedCategory = await categoryModel.deleteCategory(categoryId);
    return deletedCategory;
  }
}

const categoryService = new CategoryService();
export default categoryService;
