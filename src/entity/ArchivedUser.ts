import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

import { GENDERS } from '../constants/columnTypes';

@Entity()
export class ArchivedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

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
}
