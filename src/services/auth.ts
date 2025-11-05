import userService from './user';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import * as bcrypt from 'bcrypt';
import { AppError } from '../utils/appError';

class AuthService {
  async register(data: RegisterAuthDto) {
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }
    const hashedPassword = await bcrypt.hash(
      data.password,
      parseInt(process.env.SALT_ROUNDS as string, 10)
    );
    return await userService.createUser({
      ...data,
      password: hashedPassword,
    });
  }
}

const authService = new AuthService();
export default authService;
