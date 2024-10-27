import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
}
