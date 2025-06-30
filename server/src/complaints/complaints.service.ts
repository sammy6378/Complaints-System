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
import { ApiResponse, createResponse } from 'src/utils/responseHandler';
import { ComplaintAuditHelper } from 'src/utils/audit-helper.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly auditHelper: ComplaintAuditHelper,
  ) {}

  async create(
    createComplaintDto: CreateComplaintDto,
  ): Promise<ApiResponse<Complaint>> {
    const user = await this.userRepository.findOneBy({
      user_id: createComplaintDto.user_id,
    });
    const category = await this.categoryRepository.findOneBy({
      category_id: createComplaintDto.category_id,
    });

    if (!user || !category) {
      throw new NotFoundException(
        'Invalid references: user, category,not found',
      );
    }

    const complaint = this.complaintRepository.create({
      ...createComplaintDto,
      user,
      category,
    });

    const res = await this.complaintRepository.save(complaint);
    if (!res) {
      throw new NotFoundException('Failed to create complaint');
    }
    // 📝 Log audit
    await this.auditHelper.logComplaintCreated(
      user.user_id,
      res.complaint_id,
      res.complaint_number,
      res.complaint_title,
      res.priority,
      res.location,
      category.category_name,
    );

    return createResponse(
      res,
      `Complaint #${res.complaint_number} created successfully`,
    );
  }

  async findAll(): Promise<ApiResponse<Complaint[]>> {
    const res = await this.complaintRepository.find({
      relations: ['user', 'category'],
      order: { complaint_number: 'DESC' }, // Order by complaint number, newest first
    });
    if (!res) {
      throw new NotFoundException('No complaints found');
    }
    return createResponse(res, 'Complaints retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<Complaint>> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user', 'category'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return createResponse(complaint, 'Complaint found successfully');
  }

  async findByComplaintNumber(
    complaintNumber: number,
  ): Promise<ApiResponse<Complaint>> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_number: complaintNumber },
      relations: ['user', 'category'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint #${complaintNumber} not found`);
    }

    return createResponse(
      complaint,
      `Complaint #${complaintNumber} found successfully`,
    );
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
      order: { complaint_number: 'DESC' }, // Order by complaint number, newest first
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
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user', 'category'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    const originalStatus = complaint.complaint_status;
    const originalPriority = complaint.priority;

    await this.complaintRepository.update(id, updateComplaintDto);
    const updatedComplaintRes = await this.findOne(id);

    const updatedComplaint =
      updatedComplaintRes.data && typeof updatedComplaintRes.data !== 'string'
        ? updatedComplaintRes.data
        : null;

    if (updatedComplaint) {
      const userId = updatedComplaint.user.user_id;

      // Log status change
      if (
        updateComplaintDto.complaint_status &&
        updateComplaintDto.complaint_status !== originalStatus
      ) {
        await this.auditHelper.logComplaintStatusChange(
          userId,
          updatedComplaint.complaint_id,
          updatedComplaint.complaint_number,
          originalStatus,
          updateComplaintDto.complaint_status,
        );
      }

      // Log priority change
      if (
        updateComplaintDto.priority &&
        updateComplaintDto.priority !== originalPriority
      ) {
        await this.auditHelper.logComplaintPriorityChange(
          userId,
          updatedComplaint.complaint_id,
          updatedComplaint.complaint_number,
          originalPriority,
          updateComplaintDto.priority,
        );
      }

      updatedComplaintRes.message = `Complaint #${updatedComplaint.complaint_number} updated successfully`;
    }

    return updatedComplaintRes;
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    const result = await this.complaintRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    // 📝 Log deletion
    await this.auditHelper.logComplaintDeleted(
      complaint.user.user_id,
      complaint.complaint_id,
      complaint.complaint_number,
      complaint.complaint_title,
    );

    return createResponse(null, `Complaint with id ${id} deleted successfully`);
  }
}
