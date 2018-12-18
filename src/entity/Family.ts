import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from './User';
import { Todo } from './Todo';
import { ShoppingList } from './ShoppingList';

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => User, user => user.family)
  users: User[];

  @OneToMany(type => Todo, todo => todo.family)
  todos: Todo[];

  @OneToMany(type => ShoppingList, shoppingList => shoppingList.family)
  shoppingLists: ShoppingList[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
