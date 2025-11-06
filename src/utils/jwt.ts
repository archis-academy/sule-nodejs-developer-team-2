import { JwtPayload } from '../types/express';
import prisma from '../config/db';
import * as jwt from 'jsonwebtoken';
import { AppError } from './appError';

class JwtService {
  private splitToken(header: string) {
    if (header.startsWith('Bearer ')) {
      return header.split(' ')[1];
    }
    throw new AppError('Invalid token', 401);
  }
  private async revokeToken(header: string) {
    const token = this.splitToken(header);
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH as string
      ) as JwtPayload;
      if (!decoded.jti) {
        throw new AppError('Invalid token', 401);
      }
      const tokenRecord = await prisma.token.findUnique({
        where: { id: decoded.jti },
      });
      if (!tokenRecord || tokenRecord.revokedAt) {
        throw new AppError('Invalid token', 401);
      }
      await prisma.token.update({
        where: { id: decoded.jti },
        data: { revokedAt: new Date() },
      });
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token signature', 401);
      }
      throw new AppError('Invalid token', 401);
    }
  }
  async generateToken(payload: JwtPayload) {
    const expirationDays = parseInt(process.env.REFRESH_EXPIRE_IN || '7', 10);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS as string, {
      expiresIn: (process.env.ACCESS_EXPIRE_IN ||
        '1h') as jwt.SignOptions['expiresIn'],
    });
    const refreshTokenRecord = await prisma.token.create({
      data: {
        userId: payload.userId,
        expiresAt: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
      },
    });
    const refreshToken = jwt.sign(
      { ...payload, jti: refreshTokenRecord.id },
      process.env.JWT_REFRESH as string,
      {
        expiresIn: (expirationDays + 'd') as jwt.SignOptions['expiresIn'],
      }
    );
    return { accessToken, refreshToken };
  }
  async refresh(header: string) {
    const decoded = await this.revokeToken(header);
    const { accessToken, refreshToken } = await this.generateToken({
      userId: decoded.userId,
      role: decoded.role,
    });
    return { accessToken, refreshToken };
  }
  async logout(header: string) {
    await this.revokeToken(header);
    return { message: 'Logout successfully' };
  }
  verifyToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token signature', 401);
      }
      throw new AppError('Invalid token', 401);
    }
  }
  async logoutAll(header: string) {
    const token = this.splitToken(header);
    const decoded = this.verifyToken(token, process.env.JWT_REFRESH as string);
    const tokenRecord = await prisma.token.findUnique({
      where: { id: decoded.jti },
    });
    if (!tokenRecord || tokenRecord.revokedAt) {
      throw new AppError('Invalid token', 401);
    }
    await prisma.token.updateMany({
      where: { userId: decoded.userId },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logout all successfully' };
  }
}

const jwtService = new JwtService();
export default jwtService;
