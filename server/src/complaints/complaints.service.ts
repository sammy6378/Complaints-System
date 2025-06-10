import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { State } from 'src/states/entities/state.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    const user = await this.userRepository.findOneBy({
      id: createComplaintDto.userId,
    });
    const category = await this.categoryRepository.findOneBy({
      category_id: createComplaintDto.categoryId,
    });
    const subcategory = await this.subcategoryRepository.findOneBy({
      id: createComplaintDto.subcategoryId,
    });
    const state = await this.stateRepository.findOneBy({
      state_id: createComplaintDto.stateId,
    });

    if (!user || !category || !subcategory || !state) {
      throw new NotFoundException(
        'Invalid references: user, category, subcategory, or state not found',
      );
    }

    const complaint = this.complaintRepository.create({
      ...createComplaintDto,
      user,
      category,
      subcategory,
      state,
    });

    return await this.complaintRepository.save(complaint);
  }

  async findAll(): Promise<Complaint[]> {
    return await this.complaintRepository.find({
      relations: ['user', 'category', 'subcategory', 'state'],
      take: 20,
    });
  }

  async findOne(id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user', 'category', 'subcategory', 'state'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return complaint;
  }

  // find by status
  async findByStatus(status: string): Promise<Complaint[]> {
    const complaints = await this.complaintRepository.find({
      where: { complaint_status: status as Complaint['complaint_status'] },
      relations: ['user', 'category', 'subcategory', 'state'],
    });

    if (complaints.length === 0) {
      throw new NotFoundException(`No complaints found with status ${status}`);
    }

    return complaints;
  }

  async update(
    id: string,
    updateComplaintDto: UpdateComplaintDto,
  ): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOneBy({
      complaint_id: id,
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    const updatedComplaint = Object.assign(complaint, updateComplaintDto);
    return await this.complaintRepository.save(updatedComplaint);
  }

  async remove(id: string): Promise<string> {
    const result = await this.complaintRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return `Complaint with id ${id} removed successfully`;
  }
}
