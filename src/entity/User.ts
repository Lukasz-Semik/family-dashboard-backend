import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Family } from './Family';
import { TodoList } from './TodoList';
import { GENDERS } from '../constants/columnTypes';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password: string;

  @Column()
  isVerified: boolean;

  @Column()
  isFamilyHead: boolean;

  @Column()
  hasFamily: boolean;

  @ManyToOne(type => Family, family => family.users)
  family: Family;

  @OneToMany(type => TodoList, todoList => todoList.author)
  todoLists: TodoList[];

  @Column({
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  lastName: string;

  @Column({
    type: 'integer',
  })
  age: number;

  @Column({
    type: 'varchar',
    length: 64,
    enum: GENDERS,
  })
  gender: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
