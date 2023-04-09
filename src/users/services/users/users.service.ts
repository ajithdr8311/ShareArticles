import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDetailsDto } from 'src/users/dto/loginUserDetails.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    findUsers() {
        return this.userRepository.find();
    }

    async findUserById(id: number) {
        const user = await this.userRepository.find({
            where: {
                id: id,
            }
        })
        return user;
    }

    async findUserInDatabase(loginUserDetailsDto: LoginUserDetailsDto) {
        const salt = await bcrypt.genSalt();
        const user = await this.userRepository.find({
            where: {
                email: loginUserDetailsDto.email,
            }
        });

        return await bcrypt.compare(loginUserDetailsDto.password, user[0].password)
    }

    async createUser(userDetails: CreateUserParams) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(userDetails.password, salt);

        const newUser = this.userRepository.create({
            ...userDetails,
            password
        });
        return await this.userRepository.save(newUser);
    }

    updateUser(id: number, userDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...userDetails });
    }

    deleteUser(id: number) {
        return this.userRepository.delete({id});
    }
}
