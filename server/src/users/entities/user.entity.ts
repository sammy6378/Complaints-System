import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Check } from '../dto/create-user.dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_number: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Check, default: Check.ACTIVE })
  status: Check;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
