import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
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
}
