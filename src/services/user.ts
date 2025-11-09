import userRepository from '../repositories/user';
import { CreateUserDto } from '../dto/user/create.user';
import { AppError } from '../utils/appError';
class UserService {
  async createUser(data: CreateUserDto) {
    return await userRepository.createUser(data);
  }
  async getUserById(id: string) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
  async getUserByEmail(email: string) {
    const user = await userRepository.getUserByEmail(email);
    return user ? user : undefined;
  }
  async getUserByEmailWithPassword(email: string) {
    const user = await userRepository.getUserByEmailWithPassword(email);
    return user ? user : undefined;
  }
}

const userService = new UserService();
export default userService;
