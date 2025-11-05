import userModel from '../models/user';
import { CreateUserDto } from '../dto/user/create.user';

class UserService {
  async createUser(data: CreateUserDto) {
    return await userModel.createUser(data);
  }
  async getUserById(id: string) {
    const user = await userModel.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  async getUserByEmail(email: string) {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

const userService = new UserService();
export default userService;
