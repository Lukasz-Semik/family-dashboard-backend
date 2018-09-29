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
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  token: string;

  @Column({
    nullable: true,
  })
  confirmationAccountToken: string;

  @Column({
    nullable: true,
  })
  invitationToken: string;

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
    nullable: true,
  })
  age: number;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
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
