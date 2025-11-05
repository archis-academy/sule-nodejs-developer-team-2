import userService from './user';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import { LoginAuthDto } from '../dto/auth/login.auth';
import * as bcrypt from 'bcrypt';
import { AppError } from '../utils/appError';
import jwtService from '../utils/jwt';
class AuthService {
  async register(data: RegisterAuthDto) {
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }
    const hashedPassword = await bcrypt.hash(
      data.password,
      parseInt((process.env.SALT_ROUNDS as string) || '10', 10)
    );
    return await userService.createUser({
      ...data,
      password: hashedPassword,
    });
  }
  async login(data: LoginAuthDto) {
    const existingUser = await userService.getUserByEmailWithPassword(
      data.email
    );
    if (!existingUser) {
      throw new AppError('Invalid email or password', 401);
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }
    const { accessToken, refreshToken } = await jwtService.generateToken({
      userId: existingUser.id,
      role: existingUser.role,
    });
    return {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      accessToken,
      refreshToken,
    };
  }
}

const authService = new AuthService();
export default authService;
