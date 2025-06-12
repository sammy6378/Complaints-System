import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import {
  complaint_priority,
  complaint_status,
} from '../dto/create-complaint.dto';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  complaint_id: string;

  @Column({ nullable: false })
  complaint_title: string;

  @Column({ nullable: false, type: 'text' })
  complaint_description: string;

  @Column({
    type: 'enum',
    enum: complaint_status,
    default: complaint_status.Pending,
  })
  complaint_status: complaint_status;

  @Column({
    type: 'enum',
    enum: complaint_priority,
    default: complaint_priority.Low,
  })
  priority: complaint_priority;

  @Column({ nullable: true })
  location: string;

  //   relations
  @ManyToOne(() => User, (user) => user.complaints, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Category, (category) => category.complaints, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  category: Relation<Category>;

  @ManyToOne(() => Subcategory, (subCategory) => subCategory.complaints, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  subcategory?: Relation<Subcategory>;

  // History relation
  @OneToMany(() => ComplaintHistory, (history) => history.complaint)
  history: Relation<ComplaintHistory[]>;

  // Feedback relation
  @OneToMany(() => Feedback, (feedback) => feedback.complaint)
  feedbacks: Relation<Feedback[]>;
}
