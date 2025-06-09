import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
import { State } from 'src/states/entities/state.entity';

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
  subcategory: Relation<Subcategory>;

  @ManyToOne(() => State, (state) => state.complaints, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  state: Relation<State>;
}
