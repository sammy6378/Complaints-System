import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<ApiResponse<Feedback>> {
    const user = await this.userRepository.findOneBy({
      user_id: createFeedbackDto.user_id,
    });
    const complaint = await this.complaintRepository.findOneBy({
      complaint_id: createFeedbackDto.complaint_id,
    });

    if (!user || !complaint) {
      throw new NotFoundException('User or Complaint not found');
    }

    // send user a feedback

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      user,
      complaint,
    });

    const res = await this.feedbackRepository.save(feedback);
    if (!res) {
      throw new NotFoundException('Failed to create feedback');
    }
    return createResponse(res, 'Feedback created successfully');
  }

  async findAll(): Promise<ApiResponse<Feedback[]>> {
    const res = await this.feedbackRepository.find({
      relations: ['user', 'complaint'],
      order: { created_at: 'DESC' },
    });
    if (!res || res.length === 0) {
      throw new NotFoundException('No feedbacks found');
    }
    return createResponse(res, 'Feedbacks retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<Feedback>> {
    const feedback = await this.feedbackRepository.findOne({
      where: { feedback_id: id },
      relations: ['user', 'complaint'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return createResponse(feedback, 'Feedback found successfully');
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<ApiResponse<Feedback>> {
    const feedback = await this.feedbackRepository.findOneBy({
      feedback_id: id,
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    await this.feedbackRepository.update(id, updateFeedbackDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    const result = await this.feedbackRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return createResponse(null, `Feedback with ID ${id} deleted successfully`);
  }
}
