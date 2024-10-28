import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { User } from './users.entity';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}
    async getAll(): Promise<UserResponseDto[]>{
        const users = await this.userRepository.find()
        if (users.length === 0) throw new NotFoundException('no user found');
        return users.map(user=> new UserResponseDto(user));
    }
    async getOne(id: number): Promise<UserResponseDto> {
        const user: User = await this.userRepository.findOneBy({id});
        if (!user) throw new NotFoundException(`user with id: ${id} is not found`)
        return new UserResponseDto(user)
    }
    async findOneByEmail(email: string) : Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException(`user with email: ${email} not found`);
        return user;
    }
    async findOneByResetCode(resetCode: string): Promise<User> {
        const user = await this.userRepository.
            findOneBy({ passwordResetCode:resetCode, 
            passwordResetCodeExpires: MoreThan(new Date()) });
        if (!user) throw new NotFoundException('invalid reset code');
        return user;
    }

    async createOne(user: CreateUserDto): Promise<UserResponseDto> {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        let newUser = this.userRepository.create({...user, password: hashedPassword})
        newUser = await this.userRepository.save(newUser)
        return new UserResponseDto(newUser)
    }

    async updateOne(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
        let existingUser = await this.userRepository.findOneBy({ id })
        if (!existingUser) throw new NotFoundException(`user with id: ${id} not found`);
        if (user.password) {
            const hashed = bcrypt.hash(user.password, 12)
            user.password = hashed
        }
        existingUser = {...existingUser, ...user}
        const newUser = await this.userRepository.save(existingUser)
        return new UserResponseDto(newUser)

    }
    async saveUser(doc: User): Promise<User> {
        return await this.userRepository.save(doc)
    }
    async deleteOne(id:number) :Promise<any> {
        const res = await this.userRepository.delete(id)
        if (res.affected === 0) throw new NotFoundException(`user with id: ${id} not found`)
    }
}
