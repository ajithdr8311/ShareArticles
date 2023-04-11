import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";

@Entity({ name: 'posts' })
export class Post {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @IsNotEmpty()
    @Column()
    title: string;

    @IsNotEmpty()
    @Column()
    content: string;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: new Date() })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;

    @OneToMany(() => Like, like => like.post)
    likes: Like[];
}