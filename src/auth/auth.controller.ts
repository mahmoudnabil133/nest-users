import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sign } from 'crypto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('login')
    async signin(@Body() signInDto: any) {
        return await this.authService.signIn(signInDto.email, signInDto.password)
    }

    @Post('forgotPassword')
    async forgotPassword(@Body() body:{email: string}) {
        return await this.authService.forgotPassword(body);
    }

    @Patch('resetPassword/:resetCode')
    async resetPassword(@Param('resetCode') resetCode: string, @Body() body:{password: string}){
        return await this.authService.resetPassword(resetCode, body.password)
    }

    @UseGuards(AuthGuard)
    @Patch('changePassword')
    async changePassword(@Body() body: {oldPassword: string, newPassword: string}, @Request() req){
        return await this.authService.changePassword(req.user, body.oldPassword, body.newPassword)
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async getMe(@Request() req){
        return req.user
    }
}
// test new