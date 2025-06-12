import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';

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

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const user = await this.userRepository.findOneBy({
      id: createFeedbackDto.userId,
    });
    const complaint = await this.complaintRepository.findOneBy({
      complaint_id: createFeedbackDto.complaintId,
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

    return await this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      relations: ['user', 'complaint'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['user', 'complaint'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOneBy({ id });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    await this.feedbackRepository.update(id, updateFeedbackDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<string> {
    const result = await this.feedbackRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return `Feedback with ID ${id} deleted successfully`;
  }
}
