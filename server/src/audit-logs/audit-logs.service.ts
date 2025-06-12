import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const user = await this.userRepository.findOneBy({
      id: createAuditLogDto.userId,
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createAuditLogDto.userId} not found`,
      );
    }

    const log = this.auditLogRepository.create({
      ...createAuditLogDto,
      user,
    });

    return await this.auditLogRepository.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async findOne(id: string): Promise<AuditLog> {
    const log = await this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return log;
  }

  async update(
    id: string,
    updateAuditLogDto: UpdateAuditLogDto,
  ): Promise<AuditLog> {
    const log = await this.auditLogRepository.findOneBy({ id });

    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    await this.auditLogRepository.update(id, updateAuditLogDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<string> {
    const result = await this.auditLogRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return `Audit log with ID ${id} deleted successfully`;
  }
}
