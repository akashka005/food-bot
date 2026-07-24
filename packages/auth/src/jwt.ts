import jwt from 'jsonwebtoken';
import type { JwtPayload, UserRole } from '@smartfood/shared';
import { JWT_EXPIRES_IN } from '@smartfood/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

/**
 * Sign a new JWT token
 */
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresIn: string = JWT_EXPIRES_IN): string {
  return jwt.sign(payload as object, JWT_SECRET, { expiresIn: expiresIn as any });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate a random refresh token
 */
export function generateRefreshToken(): string {
  return require('crypto').randomBytes(40).toString('hex');
}
