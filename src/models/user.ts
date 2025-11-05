import prisma from '../config/db';
import { CreateUserDto } from '../dto/user/create.user';

class UserModel {
  async createUser(data: CreateUserDto) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
      },
    });
  }
  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}

const userModel = new UserModel();
export default userModel;
