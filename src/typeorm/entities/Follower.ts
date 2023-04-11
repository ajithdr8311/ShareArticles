import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Follower {

  @PrimaryGeneratedColumn()
  user_id: number;

  @ManyToOne(() => User, user => user.followedBy)
  followerUser: User;

  @ManyToOne(() => User, user => user.following)
  followedUser: User;
}