import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { ShoppingList } from './ShoppingList';

@Entity()
export class ShoppingListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => ShoppingList, shoppingList => shoppingList.shoppingListItems)
  shoppingList: ShoppingList;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column()
  isDone: boolean;
}
