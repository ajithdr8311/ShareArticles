import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './typeorm/entities/Post';
import { Follower } from './typeorm/entities/Follower';
import { Like } from './typeorm/entities/Like';
import { PostsService } from './posts/posts.service';
import { UsersService } from './users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'testuser',
    password: '1234',
    database: 'hashnode',
    entities: [User, Post, Follower, Like],
    synchronize: true,
  }), 
  TypeOrmModule.forFeature([User, Post, Like, Follower]),
  UsersModule, PostsModule],
  controllers: [AppController],
  providers: [AppService, UsersService, JwtService, PostsService],
})


export class AppModule {}
