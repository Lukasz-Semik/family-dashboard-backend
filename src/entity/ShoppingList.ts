import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Family } from './Family';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Family, family => family.shoppingLists)
  family: Family;

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

  @Column({
    nullable: true,
  })
  isDone: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    array: true,
  })
  upcomingItems: string[];

  @Column({
    type: 'varchar',
    nullable: true,
    array: true,
  })
  doneItems: string[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
