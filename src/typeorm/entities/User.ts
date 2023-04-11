import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { Follower } from "./Follower";
import { Like } from "./Like";

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

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Follower, follower => follower.followerUser)
    followedBy: Follower[];

    @OneToMany(() => Follower, follower => follower.followedUser)
    following: Follower[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];
}