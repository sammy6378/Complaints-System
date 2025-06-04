import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Column, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

export class State {
  @PrimaryGeneratedColumn('uuid')
  state_id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  state_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Complaint, (complaint) => complaint.state)
  complaints: Relation<Complaint[]>;
}
