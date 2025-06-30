import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComplaintHistoryDto } from './dto/create-complaint-history.dto';
import { UpdateComplaintHistoryDto } from './dto/update-complaint-history.dto';
import { ComplaintHistory } from './entities/complaint-history.entity';
import { User } from 'src/users/entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

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
  ): Promise<ApiResponse<ComplaintHistory>> {
    const user = await this.userRepository.findOneBy({
      user_id: createComplaintHistoryDto.user_id,
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

    const res = await this.complaintHistoryRepository.save(history);
    if (!res) {
      throw new NotFoundException('Failed to create complaint history');
    }
    return createResponse(res, 'Complaint history created successfully');
  }

  async findAll(): Promise<ApiResponse<ComplaintHistory[]>> {
    const res = await this.complaintHistoryRepository.find({
      relations: ['user', 'complaint'],
      order: { created_at: 'DESC' },
    });

    if (!res || res.length === 0) {
      throw new NotFoundException('No complaint histories found');
    }
    return createResponse(res, 'Complaint histories retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<ComplaintHistory>> {
    const history = await this.complaintHistoryRepository.findOne({
      where: { complaint_history_id: id },
      relations: ['user', 'complaint'],
    });

    if (!history) {
      throw new NotFoundException(`ComplaintHistory with ID ${id} not found`);
    }

    return createResponse(history, 'Complaint history found successfully');
  }

  async update(
    id: string,
    updateComplaintHistoryDto: UpdateComplaintHistoryDto,
  ): Promise<ApiResponse<ComplaintHistory>> {
    const history = await this.complaintHistoryRepository.findOneBy({
      complaint_history_id: id,
    });

    if (!history) {
      throw new NotFoundException(`ComplaintHistory with ID ${id} not found`);
    }

    await this.complaintHistoryRepository.update(id, updateComplaintHistoryDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    const result = await this.complaintHistoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ComplaintHistory with ID ${id} not found`);
    }

    return createResponse(
      null,
      `ComplaintHistory with ID ${id} deleted successfully`,
    );
  }
}
