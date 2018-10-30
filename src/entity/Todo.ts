import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Family } from './Family';
import { User } from './User';

@Entity()
export class Todo {
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

  @ManyToOne(type => User, user => user.todos)
  author: User;

  @ManyToOne(type => User, user => user.finishedTodos)
  executor: User;

  @ManyToOne(type => User, user => user.updatedTodos)
  updater: User;

  @ManyToOne(type => Family, family => family.todos)
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
