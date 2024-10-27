import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly userService: UsersService) {}

    @Get()
    async getAll(){
        return await this.userService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.userService.getOne(id)
    }
    @Post()
    async createUser(@Body() createUserDro: CreateUserDto){
        return await this.userService.createOne(createUserDro)
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto){
        return await this.userService.updateOne(id, updateUserDto)
    }
    @Delete(':id')
    async deleteOne(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.deleteOne(id)
    }
    
}