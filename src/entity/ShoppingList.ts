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
import { ShoppingListItem } from './ShoppinListItem';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Family, family => family.shoppingLists)
  family: Family;

  @OneToMany(type => ShoppingListItem, shoppingListItem => shoppingListItem.shoppingList)
  shoppingListItems: ShoppingListItem[];

  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  deadline: string;

  @Column()
  isDone: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
