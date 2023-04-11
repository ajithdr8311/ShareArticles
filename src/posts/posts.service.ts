import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/typeorm/entities/Like';
import { Post } from 'src/typeorm/entities/Post';
import { User } from 'src/typeorm/entities/User';
import { CreateUserPostParams, UpdatePostParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(Like) private likeRepository: Repository<Like>
        ) {}

    // Get All Posts
    getPosts() {
        return this.postRepository.find({
            relations: {
                user: true,
                likes: true,
            }
        });
    }


    // Get Post By UserId
    getUserPostsById(id: number) {
        return this.postRepository.find({
            relations: {
                user: true,
                likes: true,
            },
            where: {
                user: { id },
            }
        })
    }

    // Create User Post
    async createUserPost(
        id: number,
        createUserPostDetails: CreateUserPostParams
        ) {

        const user = await this.userRepository.findOneBy({ id });
        if(!user) {
            throw new HttpException(
                'User not found, Cannot create Post',
                HttpStatus.BAD_REQUEST,
            );
        } 
        const newPost = this.postRepository.create({
            ...createUserPostDetails,
            user,
            updatedAt: new Date()
        });
        return this.postRepository.save(newPost);
    }


    // Update Post By PostId
    async updatePostById(id: number, postId: number, updatePostDetails: UpdatePostParams) {
        const user = await this.userRepository.findOneBy({ id });
        if(!user) {
            throw new HttpException(
                'User not found, Cannot update Post',
                HttpStatus.BAD_REQUEST,
            );
        }

        const post = await this.postRepository.findOneBy({ id: postId });  
        if(!post) {
            throw new HttpException(
                'POst not found, Cannot update Post',
                HttpStatus.BAD_REQUEST,
            );
        }
        
        return this.postRepository.update({ id:postId }, {...updatePostDetails})
    }


    // Delete Post by Id
    async deletePostById(id: number, postId: number) {
        const user = await this.userRepository.findOneBy({ id });
        if(!user) {
            throw new HttpException(
                'User not found, Cannot update Post',
                HttpStatus.BAD_REQUEST,
            );
        }

        const post = await this.postRepository.findOneBy({ id: postId });  
        if(!post) {
            throw new HttpException(
                'POst not found, Cannot update Post',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.postRepository.delete({ id: postId })
    }


    // Update Likes
    async updateLikes(id: number, postId: number) {
        const user = await this.userRepository.findOneBy({ id });
        if(!user) {
            throw new HttpException(
                'User not found, Cannot proceed....',
                HttpStatus.BAD_REQUEST,
            );
        }

        const post = await this.postRepository.findOneBy({ id: postId });  
        if(!post) {
            throw new HttpException(
                `Post not found, Cannot proceed....`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const like = await this.likeRepository.findOneBy({ user })
        if(!like) {
            const newLike =  this.likeRepository.create({ user, post });
            return this.likeRepository.save(newLike);
        } else {
            return this.likeRepository.delete(like); 
        }
    }
}
