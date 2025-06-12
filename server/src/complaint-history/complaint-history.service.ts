import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComplaintHistoryDto } from './dto/create-complaint-history.dto';
import { UpdateComplaintHistoryDto } from './dto/update-complaint-history.dto';
import { ComplaintHistory } from './entities/complaint-history.entity';
import { User } from 'src/users/entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';

@Injectable()
export class ComplaintHistoryService {
  constructor(
    @InjectRepository(ComplaintHistory)
    private readonly complaintHistoryRepository: Repository<ComplaintHistory>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async create(
    createComplaintHistoryDto: CreateComplaintHistoryDto,
  ): Promise<ComplaintHistory> {
    const user = await this.userRepository.findOneBy({
      id: createComplaintHistoryDto.userId,
    });

    const complaint = await this.complaintRepository.findOneBy({
      complaint_id: createComplaintHistoryDto.complaintId,
    });

    if (!user || !complaint) {
      throw new NotFoundException(`User or Complaint not found`);
    }

    const history = this.complaintHistoryRepository.create({
      ...createComplaintHistoryDto,
      user,
      complaint,
    });

    return await this.complaintHistoryRepository.save(history);
  }

  async findAll(): Promise<ComplaintHistory[]> {
    return await this.complaintHistoryRepository.find({
      relations: ['user', 'complaint'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ComplaintHistory> {
    const history = await this.complaintHistoryRepository.findOne({
      where: { id },
      relations: ['user', 'complaint'],
    });

    if (!history) {
      throw new NotFoundException(`ComplaintHistory with ID ${id} not found`);
    }

    return history;
  }

  async update(
    id: string,
    updateComplaintHistoryDto: UpdateComplaintHistoryDto,
  ): Promise<ComplaintHistory> {
    const history = await this.complaintHistoryRepository.findOneBy({ id });

    if (!history) {
      throw new NotFoundException(`ComplaintHistory with ID ${id} not found`);
    }

    await this.complaintHistoryRepository.update(id, updateComplaintHistoryDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<string> {
    const result = await this.complaintHistoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ComplaintHistory with ID ${id} not found`);
    }

    return `ComplaintHistory with ID ${id} deleted successfully`;
  }
}
