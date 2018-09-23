import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  })
  password: string;

  @Column()
  isVerified: boolean;

  @Column()
  isFamilyHead: boolean;

  @Column()
  hasFamily: boolean;

  @Column({
    nullable: true,
  })
  token: string;

  @Column({
    nullable: true,
  })
  confirmationAccountToken: string;

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
