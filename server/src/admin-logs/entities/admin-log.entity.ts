import { Admin } from 'src/admins/entities/admin.entity';
import { LoginStatus } from 'src/user-logs/dto/create-user-log.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('admin_logs')
export class AdminLog {
  @PrimaryGeneratedColumn('uuid')
  logId: string;

  @Column({ type: 'enum', enum: LoginStatus, default: LoginStatus.SUCCESS })
  loginStatus: LoginStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  LoginTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Admin, (admin) => admin.adminLogs)
  @JoinColumn()
  admin: Relation<Admin>;
}
