import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Check, UserRole } from '../dto/create-user.dto';
import { UserLog } from 'src/user-logs/entities/user-log.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_number: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true, type: 'text', default: null })
  refreshToken?: string | null;

  @Column({ type: 'enum', enum: Check, default: Check.ACTIVE })
  status: Check;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  //   relatioships
  // user and user-logs [1 to * relationships]
  @OneToMany(() => UserLog, (userLog) => userLog.user)
  userLogs: Relation<UserLog[]>;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Relation<Complaint[]>;
}
