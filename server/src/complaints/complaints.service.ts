import { Injectable, NotFoundException } from '@nestjs/common';
import {
  complaint_priority,
  complaint_status,
  CreateComplaintDto,
} from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { PaginationProvider } from 'src/pagination/pagination.provider';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

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
    private readonly paginationProvider: PaginationProvider,
  ) {}

  async create(
    createComplaintDto: CreateComplaintDto,
  ): Promise<ApiResponse<Complaint>> {
    const user = await this.userRepository.findOneBy({
      id: createComplaintDto.userId,
    });
    const category = await this.categoryRepository.findOneBy({
      category_id: createComplaintDto.categoryId,
    });
    const subcategory = await this.subcategoryRepository.findOneBy({
      id: createComplaintDto.subcategoryId,
    });

    if (!user || !category || !subcategory) {
      throw new NotFoundException(
        'Invalid references: user, category, subcategory,not found',
      );
    }

    const complaint = this.complaintRepository.create({
      ...createComplaintDto,
      user,
      category,
      subcategory,
    });

    const res = await this.complaintRepository.save(complaint);
    if (!res) {
      throw new NotFoundException('Failed to create complaint');
    }
    return createResponse(res, 'Complaint created successfully');
  }

  async findAll(): Promise<ApiResponse<Complaint[]>> {
    const res = await this.complaintRepository.find({
      relations: ['user', 'category', 'subcategory'],
    });
    if (!res) {
      throw new NotFoundException('No complaints found');
    }
    return createResponse(res, 'Complaints retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<Complaint>> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user', 'category', 'subcategory'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return createResponse(complaint, 'Complaint found successfully');
  }

  // Find complaints filtered by optional status and priority
  async findFiltered(
    status?: complaint_status,
    priority?: complaint_priority,
  ): Promise<ApiResponse<Complaint[]>> {
    interface FilterOptions {
      status?: complaint_status;
      priority?: complaint_priority;
    }

    const filterOptions: FilterOptions = {};
    if (status) filterOptions.status = status;
    if (priority) filterOptions.priority = priority;

    const res = await this.complaintRepository.find({
      where: {
        ...(status && { complaint_status: status }),
        ...(priority && { priority }),
      },
    });
    if (!res || res.length === 0) {
      throw new NotFoundException('No complaints found with the given filters');
    }
    return createResponse(res, 'Filtered complaints retrieved successfully');
  }

  async update(
    id: string,
    updateComplaintDto: UpdateComplaintDto,
  ): Promise<ApiResponse<Complaint | string>> {
    const complaint = await this.complaintRepository.findOneBy({
      complaint_id: id,
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    await this.complaintRepository.update(id, updateComplaintDto);

    // save complaint history

    return await this.findOne(id);
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    const result = await this.complaintRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return createResponse(null, `Complaint with id ${id} deleted successfully`);
  }
}
