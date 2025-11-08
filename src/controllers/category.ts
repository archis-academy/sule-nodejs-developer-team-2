import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import categoryService from '../services/category';
import { CreateCategoryDto } from '../dto/category/create.category';
import { UpdateCategoryDto } from '../dto/category/update.category';

class CategoryController {
  async createCategory(
    req: Request<{ id: string }, Record<string, never>, CreateCategoryDto>,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const teamId = id;
      const category = await categoryService.createCategory(teamId, { name });
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async getTeamCategories(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const teamId = id;
      const categories = await categoryService.getTeamCategories(teamId);
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async updateCategory(
    req: Request<
      { id: string; categoryId: string },
      Record<string, never>,
      UpdateCategoryDto
    >,
    res: Response
  ) {
    try {
      const { id, categoryId } = req.params;
      const { name } = req.body;
      const teamId = id;
      const category = await categoryService.updateCategory(
        teamId,
        categoryId,
        { name }
      );
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async deleteCategory(
    req: Request<{ id: string; categoryId: string }>,
    res: Response
  ) {
    try {
      const { id, categoryId } = req.params;
      const teamId = id;
      await categoryService.deleteCategory(teamId, categoryId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}

const categoryController = new CategoryController();
export default categoryController;
