import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isFamilyHead: boolean;

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
}
