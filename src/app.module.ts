import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'testuser',
    password: '1234',
    database: 'hashnode',
    entities: [User],
    synchronize: true,
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
