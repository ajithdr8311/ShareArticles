import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDetailsDto } from 'src/users/dto/loginUserDetails.dto';
import { Follower } from 'src/typeorm/entities/Follower';
import { Like } from 'src/typeorm/entities/Like';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Follower) private followerRepository: Repository<Follower>,
        @InjectRepository(Like) private likeRepository: Repository<Like> 
        ) {}

    findUsers() {
        return this.userRepository.find({ relations: ['posts', 'posts.likes', 'followedBy', 'following'] });
    }

    async findUserById(id: number) {
        const user = await this.userRepository.find({
            relations: {
                posts: true,
                followedBy: true,
                following: true
            },
            where: { id }
        })
        return user;
    }

    async findUserInDatabase(loginUserDetailsDto: LoginUserDetailsDto) {
        const user = await this.userRepository.find({
            where: {
                email: loginUserDetailsDto.email,
            }
        });

        if(user.length === 0) {
            this.throwException(401, 'Invalid Email address');
        } else {
            const isCorrectPassword = await bcrypt.compare(loginUserDetailsDto.password, user[0].password);
            if(isCorrectPassword) {
                return HttpStatus.OK;
            } else {
                this.throwException(401, 'Invalid Password');
            }
        }
    }


    async createUser(userDetails: CreateUserParams) {
        const user = await this.userRepository.find({
            where: [
                {username: userDetails.username},
                {email: userDetails.email},
            ],
        })
        if(user.length > 0) {
            if(user[0].username == userDetails.username) {
                this.throwException(403, 'Username already exists. Please choose another username')
            } else if(user[0].email == userDetails.email) {
                this.throwException(403, 'Email already exists')
            }
        }

        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(userDetails.password, salt);

        const newUser = this.userRepository.create({
            ...userDetails,
            password
        });
        await this.userRepository.save(newUser);
        return HttpStatus.CREATED;
    }

    updateUser(id: number, userDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...userDetails });
    }

    deleteUser(id: number) {
        return this.userRepository.delete({id});
    }


    // Update Follower
    async updateFollower(action: string, id: number, userId: number) {
        const user = await this.userRepository.findOneBy({id});
        const followedUser = await this.userRepository.findOneBy({id: userId});
        if(id == userId) {
            throw new HttpException(
                `User cannot ${action} him/her self`,
                HttpStatus.BAD_REQUEST,
            );
        } else if(!user || !followedUser) {
            throw new HttpException(
                'User Not found',
                HttpStatus.NOT_FOUND
            );
        }

        if(action == 'follow') {
            let follower = await this.followerRepository.findOneBy({
                followerUser: followedUser
            });

            if(follower) {
                return { "msg": `User already follows them` }
            } else {
                follower = this.followerRepository.create({
                    followerUser: followedUser,
                    followedUser: user
                })
                return this.followerRepository.save(follower);
            }
        } else {
            const follower = await this.followerRepository.findOneBy({
                followerUser: followedUser
            });
            if(!follower) {
                throw new HttpException(
                    'User must follow before Unfollow',
                    HttpStatus.BAD_REQUEST
                );
            }
            return this.followerRepository.delete({ user_id: follower.user_id })            
        }
    }


    // Throw error
    throwException(status: number, message: string) {

        if(status == 401) {
            throw new HttpException(
                message,
                HttpStatus.UNAUTHORIZED
            )
        }

        if(status == 403) {
            throw new HttpException(
                message,
                HttpStatus.FORBIDDEN
            )
        }
    } 
}
