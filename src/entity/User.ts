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
import { Todo } from './Todo';
import { GENDERS } from '../constants/columnTypes';
import { ShoppingList } from './ShoppingList';

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

  @OneToMany(type => Todo, todo => todo.author)
  todos: Todo[];

  @OneToMany(type => Todo, todo => todo.executor)
  finishedTodos: Todo[];

  @OneToMany(type => Todo, todo => todo.updater)
  updatedTodos: Todo[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.author)
  shoppingLists: ShoppingList[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.executor)
  doneShoppingLists: ShoppingList[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.updater)
  updatedShoppingLists: ShoppingList[];

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
    type: 'varchar',
    length: 255,
  })
  birthDate: string;

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
