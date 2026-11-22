import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const getSecret = () => process.env.JWT_SECRET || 'crew_chat_jwt_secret_dev_2026_xyz';

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
