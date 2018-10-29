import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { Family } from './Family';
import { User } from './User';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description: string;

  @Column()
  isDone: boolean;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  deadline: string;

  @ManyToOne(type => User, user => user.todoLists)
  author: User;

  @ManyToOne(type => Family, family => family.todoLists)
  family: Family;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
