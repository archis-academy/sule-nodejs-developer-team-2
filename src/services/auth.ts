import userService from './user';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import * as bcrypt from 'bcrypt';

class AuthService {
  async register(data: RegisterAuthDto) {
    await userService.getUserByEmail(data.email);
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
