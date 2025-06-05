import { Injectable } from '@nestjs/common';
import { CreateUserLogDto } from './dto/create-user-log.dto';
import { UpdateUserLogDto } from './dto/update-user-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLog } from './entities/user-log.entity';
import { Repository } from 'typeorm';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserLogsService {
  constructor(
    @InjectRepository(UserLog) private logsRepository: Repository<UserLog>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    createUserLogDto: CreateUserLogDto,
  ): Promise<ApiResponse<UserLog>> {
    const user = await this.userRepository.findOneBy({
      id: createUserLogDto.userId,
    });
    if (!user) {
      throw new Error(`User with id ${createUserLogDto.userId} not found`);
    }
    const userLog = this.logsRepository.create({
      ...createUserLogDto,
      user: user,
    });

    return await this.logsRepository
      .save(userLog)
      .then((log) => {
        return createResponse(log, 'User log created successfully');
      })
      .catch((err) => {
        console.error('Error creating user log:', err);
        throw new Error('Failed to create user log');
      });
  }

  async findAll() {
    return await this.logsRepository.find({
      order: { created_at: 'DESC' },
      take: 50, // Limit to 50
    });
  }

  async findOne(id: string): Promise<ApiResponse<UserLog> | string> {
    return this.logsRepository
      .findOneBy({ log_id: id })
      .then((log) => {
        if (!log) {
          return `User log with id ${id} not found`;
        }
        return createResponse(log, 'User log found successfully');
      })
      .catch((err) => {
        console.error('Error finding user log', err);
        throw new Error('User log not found');
      });
  }

  async update(
    id: string,
    updateUserLogDto: UpdateUserLogDto,
  ): Promise<ApiResponse<UserLog> | string> {
    await this.logsRepository.update(id, updateUserLogDto).then((log) => {
      if (!log.affected) {
        throw new Error(`User log with id ${id} not found`);
      }
    });
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.logsRepository.delete(id).then((res) => {
      if (res.affected === 0) {
        throw new Error(`User log with id ${id} not found`);
      }
      return createResponse(res, 'User log deleted successfully');
    });
  }
}
