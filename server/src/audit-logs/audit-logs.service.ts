import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto, AuditAction } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createAuditLogDto: CreateAuditLogDto,
  ): Promise<ApiResponse<AuditLog>> {
    const user = await this.userRepository.findOneBy({
      user_id: createAuditLogDto.user_id,
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createAuditLogDto.user_id} not found`,
      );
    }

    const log = this.auditLogRepository.create({
      ...createAuditLogDto,
      user,
    });

    const res = await this.auditLogRepository.save(log);
    if (!res) {
      throw new NotFoundException('Failed to create audit log');
    }
    return createResponse(res, 'Audit log created successfully');
  }

  async findAll(): Promise<ApiResponse<AuditLog[]>> {
    const res = await this.auditLogRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 50,
    });
    if (!res || res.length === 0) {
      throw new NotFoundException('No audit logs found');
    }
    return createResponse(res, 'Audit logs retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<AuditLog>> {
    const log = await this.auditLogRepository.findOne({
      where: { audit_id: id },
      relations: ['user'],
    });

    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return createResponse(log, 'Audit log found successfully');
  }

  async update(
    id: string,
    updateAuditLogDto: UpdateAuditLogDto,
  ): Promise<ApiResponse<AuditLog>> {
    const log = await this.auditLogRepository.findOneBy({ audit_id: id });

    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    await this.auditLogRepository.update(id, updateAuditLogDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    const result = await this.auditLogRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return createResponse(null, `Audit log with ID ${id} deleted successfully`);
  }

  /**
   * Find audit logs for a specific resource (e.g., a complaint)
   */
  async findByResource(
    resource: string,
    resourceId: string,
  ): Promise<ApiResponse<AuditLog[]>> {
    const logs = await this.auditLogRepository.find({
      where: {
        resource,
        resource_id: resourceId,
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return createResponse(
      logs,
      `Audit logs for ${resource} ${resourceId} retrieved successfully`,
    );
  }

  /**
   * Find audit logs by user
   */
  async findByUser(userId: string): Promise<ApiResponse<AuditLog[]>> {
    const logs = await this.auditLogRepository.find({
      where: {
        user: { user_id: userId },
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 100, // Limit to last 100 actions
    });

    return createResponse(
      logs,
      `Audit logs for user ${userId} retrieved successfully`,
    );
  }

  /**
   * Find audit logs by action type
   */
  async findByAction(action: string): Promise<ApiResponse<AuditLog[]>> {
    const logs = await this.auditLogRepository.find({
      where: {
        action: action as AuditAction,
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 100,
    });

    return createResponse(
      logs,
      `Audit logs for action '${action}' retrieved successfully`,
    );
  }

  /**
   * Find audit logs within a date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ApiResponse<AuditLog[]>> {
    const logs = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.user', 'user')
      .where('audit_log.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('audit_log.created_at', 'DESC')
      .getMany();

    return createResponse(
      logs,
      `Audit logs from ${startDate.toISOString()} to ${endDate.toISOString()} retrieved successfully`,
    );
  }

  /**
   * Get complaint timeline/history
   */
  async getComplaintTimeline(
    complaintId: string,
  ): Promise<ApiResponse<AuditLog[]>> {
    const timeline = await this.auditLogRepository.find({
      where: {
        resource: 'Complaint',
        resource_id: complaintId,
      },
      relations: ['user'],
      order: { created_at: 'ASC' }, // Chronological order for timeline
    });

    return createResponse(
      timeline,
      `Timeline for complaint ${complaintId} retrieved successfully`,
    );
  }

  /**
   * Get complaints with recent activity
   */
  async getRecentComplaintActivity(
    days: number = 7,
  ): Promise<ApiResponse<AuditLog[]>> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const recentActivity = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.user', 'user')
      .where('audit_log.resource = :resource', { resource: 'Complaint' })
      .andWhere('audit_log.created_at >= :daysAgo', { daysAgo })
      .orderBy('audit_log.created_at', 'DESC')
      .limit(50)
      .getMany();

    return createResponse(
      recentActivity,
      `Recent complaint activity for last ${days} days retrieved successfully`,
    );
  }

  /**
   * Get complaint audit summary for a specific complaint
   */
  async getComplaintAuditSummary(complaintId: string): Promise<
    ApiResponse<{
      complaint_id: string;
      total_activities: number;
      creation_date: Date;
      last_activity: Date;
      status_changes: number;
      priority_changes: number;
      views: number;
      participants: string[];
    }>
  > {
    const logs = await this.auditLogRepository.find({
      where: {
        resource: 'Complaint',
        resource_id: complaintId,
      },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });

    if (logs.length === 0) {
      throw new NotFoundException(
        `No audit logs found for complaint ${complaintId}`,
      );
    }

    const summary = {
      complaint_id: complaintId,
      total_activities: logs.length,
      creation_date: logs[0].created_at,
      last_activity: logs[logs.length - 1].created_at,
      status_changes: logs.filter((log) =>
        log.details.includes('Status changed'),
      ).length,
      priority_changes: logs.filter((log) =>
        log.details.includes('Priority changed'),
      ).length,
      views: logs.filter((log) => log.action === AuditAction.VIEW).length,
      participants: [...new Set(logs.map((log) => log.user.email))],
    };

    return createResponse(
      summary,
      `Audit summary for complaint ${complaintId} retrieved successfully`,
    );
  }
}
