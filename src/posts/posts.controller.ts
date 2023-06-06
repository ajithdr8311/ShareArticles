import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateUserPostDto } from 'src/users/dto/createUserPost.dto';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { UpdatePostDto } from 'src/users/dto/updatePostDto.dto';

@Controller('user')
export class PostsController {
    constructor(private postService: PostsService) {}

    @Get()
    async getPosts() {
        const posts = await this.postService.getPosts();
        return posts; 
    }

    @Get(':id')
    async getPostById(@Param('id', ParseIntPipe) id: number) {
        return this.postService.getPostById(id);
    }

    @Get(':id/posts')
    getUserPostsById(@Param('id', ParseIntPipe) id: number) {
        return this.postService.getUserPostsById(id)
    }

    @Post(':id/posts')
    createUserPost(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserPostDto: CreateUserPostDto
        ) {
            
        return this.postService.createUserPost(id, createUserPostDto);
    }

    @Put(':id/posts/:postId')
    async updateUserPost(
        @Param('id', ParseIntPipe) id: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() updatePostDto: UpdatePostDto
    ) {
        
        const result = await this.postService.updatePostById(id, postId, updatePostDto);
        if(result.affected > 0) {
            return { "msg": `Post Updated Successfully!!` }
        }
    }

    @Delete(':id/posts/:postId')
    async deletePostById(
        @Param('id', ParseIntPipe) id: number,
        @Param('postId', ParseIntPipe) postId: number
        ) {

            return await this.postService.deletePostById(id, postId);
        }


    // Get like status of a user
    @Get(':id/posts/:postId')
    async getLikeStatus(
        @Param('id', ParseIntPipe) id: number,
        @Param('postId', ParseIntPipe) postId: number
    ) {
        return this.postService.getLikeStatus(id, postId);
    }

    // Update Like
    @Post(':id/posts/:postId')
    async updateLike(
        @Param('id', ParseIntPipe) id: number,
        @Param('postId', ParseIntPipe) postId: number
    ) {
        
        return this.postService.updateLikes(id, postId)
    }
}
