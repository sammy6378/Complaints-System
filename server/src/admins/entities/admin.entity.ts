import { Exclude } from 'class-transformer';
import { AdminLog } from 'src/admin-logs/entities/admin-log.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  adminId: string;

  @Column()
  username: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => AdminLog, (adminLog) => adminLog.admin, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  adminLogs: Relation<AdminLog[]>;
}
