import prisma from '../config/db';
import { CreateUserDto } from '../dto/user/create.user';

class UserModel {
  async createUser(data: CreateUserDto) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
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
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
  async getUserByEmailWithPassword(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
  }
}

const userModel = new UserModel();
export default userModel;
