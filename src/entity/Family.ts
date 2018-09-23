import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  familyName: string;

  @OneToMany(type => User, user => user.family)
  users: User[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
