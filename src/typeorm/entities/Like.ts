import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity({ name: 'likes' })
export class Like {

    @PrimaryGeneratedColumn()
    like_id: number;

    @ManyToOne(() => User, user => user.likes)
    user: User;

    @ManyToOne(() => Post, post => post.likes)
    post: Post;
}