import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromRequest(request);
    if (!token) {
      // unauthorized
      throw new HttpException('you are not Unauthorized', 401);
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('JWT_SECRET')
        }
      );
      const user = await this.userService.getOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
      return true;
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
