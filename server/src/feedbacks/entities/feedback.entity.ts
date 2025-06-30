import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedback_id: string;

  @Column('text')
  message: string;

  @Column({ type: 'int', nullable: true })
  rating?: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.feedbacks, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @ManyToOne(() => Complaint, (complaint) => complaint.feedbacks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  complaint?: Relation<Complaint>;
}
