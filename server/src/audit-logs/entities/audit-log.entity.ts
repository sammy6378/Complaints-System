import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuditAction } from '../dto/create-audit-log.dto';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column()
  resource: string;

  @Column({ nullable: true })
  resource_id: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: 'CASCADE' })
  user: Relation<User>;
}
