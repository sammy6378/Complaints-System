import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Check, UserRole } from '../dto/create-user.dto';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Exclude } from 'class-transformer';
import { AuditLog } from 'src/audit-logs/entities/audit-log.entity';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

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
  refresh_token?: string | null;

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

  // user and complaints [1 to * relationships]
  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Relation<Complaint[]>;

  // user and audit-logs [1 to * relationships]
  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: Relation<AuditLog[]>;

  // user and complaint-history [1 to * relationships]
  @OneToMany(() => ComplaintHistory, (history) => history.user)
  history: Relation<ComplaintHistory[]>;

  // user and notifications [1 to * relationships]
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Relation<Notification[]>;

  // user and feedbacks [1 to * relationships]
  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Relation<Feedback[]>;
}
