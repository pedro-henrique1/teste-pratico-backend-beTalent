import User from '#models/user'
import env from '#start/env'
import jwt, { type SignOptions } from 'jsonwebtoken'

export default class JwtService {
  static generate(user: User): string {
    const secret = env.get('APP_KEY_JWT')
    const expiresIn = env.get('JWT_EXPIRES_IN') as SignOptions['expiresIn']

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
      issuer: 'api_betalent',
      subject: user.id.toString(),
    })
  }

  static verify(token: string): jwt.JwtPayload | null {
    const secret = env.get('APP_KEY_JWT')
    try {
      return jwt.verify(token, secret) as jwt.JwtPayload
    } catch (error) {
      return null
    }
  }
}
