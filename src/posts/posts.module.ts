import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { User } from 'src/typeorm/entities/User';
import { Like } from 'src/typeorm/entities/Like';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Like])],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
