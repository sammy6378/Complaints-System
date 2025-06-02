import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminLogDto } from './dto/create-admin-log.dto';
import { UpdateAdminLogDto } from './dto/update-admin-log.dto';
import { AdminLog } from './entities/admin-log.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class AdminLogsService {
  constructor(
    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(
    createAdminLogDto: CreateAdminLogDto,
  ): Promise<ApiResponse<AdminLog>> {
    try {
      const admin = await this.adminRepository.findOneBy({
        adminId: createAdminLogDto.adminId,
      });
      if (!admin) {
        throw new Error(`Admin with ID ${createAdminLogDto.adminId} not found`);
      }

      const newLog = this.adminLogRepository.create({
        ...createAdminLogDto,
        admin,
      });

      const savedLog = await this.adminLogRepository.save(newLog);
      return createResponse(savedLog, 'Admin log created successfully');
    } catch (error) {
      console.error('Error creating admin log:', error);
      throw new Error('Failed to create admin log');
    }
  }

  async findAll(): Promise<ApiResponse<AdminLog[]>> {
    try {
      const logs = await this.adminLogRepository.find({ relations: ['admin'] });
      return createResponse(logs, 'Admin logs retrieved successfully');
    } catch (error) {
      console.error('Error retrieving admin logs:', error);
      throw new Error('Failed to retrieve admin logs');
    }
  }

  async findOne(id: string): Promise<ApiResponse<AdminLog> | string> {
    try {
      const log = await this.adminLogRepository.findOne({
        where: { logId: id },
        relations: ['admin'],
      });

      if (!log) {
        return `Admin log with ID ${id} not found`;
      }

      return createResponse(log, 'Admin log retrieved successfully');
    } catch (error) {
      console.error('Error retrieving admin log:', error);
      throw new Error('Failed to retrieve admin log');
    }
  }

  async update(
    id: string,
    updateAdminLogDto: UpdateAdminLogDto,
  ): Promise<ApiResponse<AdminLog> | string> {
    try {
      const log = await this.adminLogRepository.findOneBy({ logId: id });
      if (!log) {
        return `Admin log with ID ${id} not found`;
      }

      await this.adminLogRepository.update(id, updateAdminLogDto);
      return this.findOne(id);
    } catch (error) {
      console.error('Error updating admin log:', error);
      throw new Error('Failed to update admin log');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.adminLogRepository.delete(id);
      if (result.affected === 0) {
        return `Admin log with ID ${id} not found`;
      }

      return `Admin log with ID ${id} deleted successfully`;
    } catch (error) {
      console.error('Error deleting admin log:', error);
      throw new Error('Failed to delete admin log');
    }
  }
}
