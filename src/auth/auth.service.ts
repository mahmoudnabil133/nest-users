import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { JwtService } from '@nestjs/jwt';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { User } from 'src/users/users.entity';


class forgotPassword {
    email: string
}
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private nodemailerService: NodemailerService
    ) {}

    async signIn(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {sub:user.id, email: user.email}
        const token = await this.jwtService.signAsync(payload)

        return {
            access_token: token
        }

    }

    async forgotPassword(body: forgotPassword) {
        console.log(body.email)
        const user = await this.usersService.findOneByEmail(body.email);
        if (!user) {
            throw new HttpException('user not found', 404);
        }
        const resetCode = this.nodemailerService.generateResetCode();
        user.passwordResetCode = this.createHash(resetCode);
        user.passwordResetCodeExpires = new Date(Date.now() + 2 * 60 * 1000) // token expires after 2 minutes
        await this.usersService.saveUser(user);
        try{
            await this.nodemailerService.sendChangepasswordCode({ email: body.email, resetCode });
        }catch(err){
            user.passwordResetCode = undefined;
            user.passwordResetCodeExpires = undefined;
            await this.usersService.saveUser(user);
            throw new HttpException('couldnt send email', 500); 
        }
        return {message: 'reset code sent to your email', resetCode: resetCode}
    }
    async resetPassword(resetCode: string, password:string){
        const hashedCode = this.createHash(resetCode);
        const user = await this.usersService.findOneByResetCode(hashedCode);
        if (!user) {
            throw new HttpException('invalid reset code', 404);
        };
        user.password = await bcrypt.hash(password, 12);
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined; 
        await this.usersService.saveUser(user);
        return {msg: 'password changed'}

    }
    async changePassword(user:User, oldPassword:string, newPassword:string) {
        if (!await bcrypt.compare(oldPassword, user.password)) {
            throw new HttpException('invalid password', 404);
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.passwordChangedAt = new Date();
        await this.usersService.saveUser(user);
        return {msg: 'password changed'}
    }
    createHash(code: string){
        return crypto.createHash('sha256').update(code).digest('hex')
    }
}
