import { Category } from 'src/categories/entities/category.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  subcategoryName: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  category: Relation<Category>;

  @OneToMany(() => Complaint, (complaint) => complaint.subcategory)
  complaints: Relation<Complaint[]>;
}
