import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Render, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { PostsService } from './posts/posts.service';
import { Request, Response } from 'express';
import { UsersService } from './users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UpdatePostDto } from './users/dto/updatePostDto.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly postService: PostsService
    ) {}

  @Get()
  @Render('index')
  root() {}

  @Get('onboard')
  @Render('onboard')
  registerPage() {}

  @Get('signin')
  @Render('login')
  loginPage() {}

  @Get('home')
  @Render('home')
  homePage() {}

  @Get('write/:id')
  @Render('create-post')
  createPost(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }

  @Get('blog/:id')
  @Render('blog-post')
  async blogPage(@Param('id', ParseIntPipe) id: number) {
    // const result = await this.postService.getPostById(id);
    // console.log(result[0].user);
    // return { data: JSON.stringify(result) };
    return { id };
  }

  @Get('profile/:id')
  @Render('user-profile')
  profilePage(@Param('id', ParseIntPipe) id: number) {
    return { id }; 
  }

  @Get('edit/:id')
  @Render('edit-post')
  editBLogPost(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }

  @Get('edit-profile/:id')
  @Render('edit-user-profile')
  editProfile(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }

  
  @Put('save/:id')
  savePostChanges(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto) {
      return this.postService.savePostChanges(id, updatePostDto);
  }
}