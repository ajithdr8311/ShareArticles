import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @IsNotEmpty()
    @Column({ unique: true })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @IsNotEmpty()
    @Length(8,24)
    @Column()
    password: string;

    
    @Column({ nullable: true })
    bio: string;
}