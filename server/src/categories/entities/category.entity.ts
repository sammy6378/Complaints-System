import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { Column, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

export class Category {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column()
  category_name: string;

  @Column({ type: 'text' })
  decription: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Subcategory, (subCategory) => subCategory.category)
  subCategories: Relation<Subcategory[]>;

  @OneToMany(() => Complaint, (complaint) => complaint.category)
  complaints: Relation<Complaint[]>;
}
