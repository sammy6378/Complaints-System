import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { User } from 'src/users/entities/user.entity';
import { ComplaintStatus } from '../dto/create-complaint-history.dto';

@Entity('complaint_history')
export class ComplaintHistory {
  @PrimaryGeneratedColumn('uuid')
  complaint_history_id: string;

  @Column({ type: 'enum', enum: ComplaintStatus })
  from_status: ComplaintStatus;

  @Column({ type: 'enum', enum: ComplaintStatus })
  to_status: ComplaintStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Complaint, (complaint) => complaint.history, {
    onDelete: 'CASCADE',
  })
  complaint: Relation<Complaint>;

  @ManyToOne(() => User, (user) => user.history, {
    onDelete: 'SET NULL',
  })
  user: Relation<User>;
}
