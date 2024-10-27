import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromRequest(request);
    if (!token) {
      return false;
    }
    try {
      const payload = this.jwtService.verifyAsync(
        token,
        {
          secret: 'my_secret_key'
        }
      );
    } catch {
      throw new UnauthorizedException()
    }
  }
  private getTokenFromRequest(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) return undefined;
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') return undefined;
    return token;
  }
}
