import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Redirect, Render, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { LoginUserDetailsDto } from 'src/users/dto/loginUserDetails.dto';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    async getUsers() {
        const users = await this.userService.findUsers();
        return users;
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

    // @Get('register')
    // @Render('register')
    // showRegisterPage() {

    // }

    // @Get('user/login')
    // @Render('login')
    // showLoginPage() {

    // }

    // @Post('user/register')
    // async root(
    //     @Res() res: Response, 
    //     @Body() createUserDto: CreateUserDto
    //     ) {
    //         const { username, email, password } = { ...createUserDto }
    //         if(!username || !email || !password) {
    //             return res.render(
    //                 'register',
    //                 { 'error_message': 'Please fill all the fields'} 
    //             ) 
    //         } else {
    //             const fileName = await this.userService.createUser(createUserDto);
    //             console.log('data added successfully');
                
    //             return res.render(
    //                 'login',
    //                 {}
    //             )
    //         }
    //     }

    @Post('register')
    async createUser(
        @Body() createUserDto: CreateUserDto
        ){  
        
        return this.userService.createUser(createUserDto);
    }


    @Post('login')
    async findUserInDatabase(@Body() loginUserDetailsDto: LoginUserDetailsDto) {
        const isUserExist = await this.userService.findUserInDatabase(loginUserDetailsDto);
        if(isUserExist) {
            return { "msg": "Logged In successfully" }
        } else {
            return { "msg": "Incorrect email or password" }
        }
    }

    @Put(':id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateUserDto: UpdateUserDto
        ) {
        await this.userService.updateUser(id, updateUserDto)
        return { "msg": `User with ${id} got updated` }
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
}
