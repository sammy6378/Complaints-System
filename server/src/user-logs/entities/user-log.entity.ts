import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { LoginStatus } from '../dto/create-user-log.dto';
import { User } from 'src/users/entities/user.entity';

@Entity('user_logs')
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  log_id: string;

  @Column({ type: 'enum', enum: LoginStatus, default: LoginStatus.SUCCESS })
  loginStatus: LoginStatus;

  @Column()
  action: string;

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
  @ManyToOne(() => User, (user) => user.userLogs, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;
}

// note
// 💡 Best Practices
// Always start with the ManyToOne side – it owns the relation. - has the foreign key.

// The OneToMany side just references back using the property name in the owning side.

// Use onDelete: 'CASCADE' if you want logs to be deleted when a user is deleted.
