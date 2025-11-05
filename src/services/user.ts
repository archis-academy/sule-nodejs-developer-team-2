import userModel from '../models/user';
import { CreateUserDto } from '../dto/user/create.user';
import { AppError } from '../utils/appError';
class UserService {
  async createUser(data: CreateUserDto) {
    return await userModel.createUser(data);
  }
  async getUserById(id: string) {
    const user = await userModel.getUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
  async getUserByEmail(email: string) {
    const user = await userModel.getUserByEmailWithPassword(email);
    return user ? user : undefined;
  }
}

const userService = new UserService();
export default userService;
