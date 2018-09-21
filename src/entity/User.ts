import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { UserProfile } from './UserProfile';

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

  @Column({
    nullable: true,
  })
  token: string;

  @Column({
    nullable: true,
  })
  confirmationAccountToken: string;

  @OneToOne(type => UserProfile)
  @JoinColumn()
  userProfile: UserProfile;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;
}
