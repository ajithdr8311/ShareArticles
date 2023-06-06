import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Redirect, Render, Req, Res, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { LoginUserDetailsDto } from 'src/users/dto/loginUserDetails.dto';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
        ) {}

    @Get('/activeuser')
    async activeUser(@Req() request: Request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if(!data) {
                throw new UnauthorizedException();
            }

            const user = await this.userService.findUserById(data.id);
            const { password, ...result } = user[0];
            return result;

        } catch(err) {
            throw new UnauthorizedException();
        }
    }

    @Get(':id')
    async getUserById(
        @Res() res: Response,
        @Param('id', ParseIntPipe) id: number
        ) {
        const userDetails = await this.userService.findUserById(id);
        if(userDetails.length > 0) {
            return res.send(userDetails);
        } else {
            res.status(HttpStatus.NOT_FOUND).json({"msg": `User Not Found`})
        }
    }

    @Get()
    async getUsers() {
        const users = await this.userService.findUsers();
        return users;
    }

    @Post('register')
    async createUser(
        @Body() createUserDto: CreateUserDto
        ){  
        
        return this.userService.createUser(createUserDto);
    }


    @Post('login')
    async findUserInDatabase(
        @Body() loginUserDetailsDto: LoginUserDetailsDto,
        @Res({ passthrough: true }) response: Response
        ) {
        const user = await this.userService.findUserInDatabase(loginUserDetailsDto);
        const jwt = await this.jwtService.signAsync({ id: user.id });
        response.cookie('jwt', jwt, { httpOnly: true });
        return {
            statusCode: 200,
            message: 'Logged In'
        };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');
        return {
            message: 'Logout Successful!!'
        }
    }

    @Put(':id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateUserDto: UpdateUserDto
        ) {
        return await this.userService.updateUser(id, updateUserDto);
    }


    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        const result = await this.userService.deleteUser(id)
        if(result.affected > 0) {
            return { "msg": `User with ID ${id} deleted` }
        } else {
            return { "msg": `User with ID ${id} does not exist` }
        }
    }


    // Follow User
    @Post(':id/follow/:userId')
    async updateFollow(
        @Param('id', ParseIntPipe) id: number,
        @Param('userId', ParseIntPipe) userId: number
    ) {
        const result = await this.userService.updateFollower('follow', id, userId);
        return result;
    }

    // Unfollow User
    @Post(':id/unfollow/:userId')
    async updateUnfollow(
        @Param('id', ParseIntPipe) id: number,
        @Param('userId', ParseIntPipe) userId: number
    ) {
        const result = await this.userService.updateFollower('unfollow', id, userId);
        return result;
    }
}
