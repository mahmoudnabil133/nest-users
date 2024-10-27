import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sign } from 'crypto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('login')
    async signin(@Body() signInDto: any) {
        return await this.authService.signIn(signInDto.email, signInDto.password)
    }
}
