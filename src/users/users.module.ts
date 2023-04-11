import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Post } from 'src/typeorm/entities/Post';
import { Follower } from 'src/typeorm/entities/Follower';
import { Like } from 'src/typeorm/entities/Like';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Follower, Like])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
