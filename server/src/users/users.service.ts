import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return await this.userRepository
      .save(createUserDto)
      .then((user) => {
        return createResponse(user, 'User created successfully');
      })
      .catch((err) => {
        console.error('Error creating user:', err);
        throw new Error('Failed to create user');
      });
  }

  async findAll(full_name?: string) {
    if (full_name) {
      return await this.userRepository.find({
        where: { full_name },
      });
    }
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<ApiResponse<User> | string> {
    return await this.userRepository
      .findOneBy({ id })
      .then((user) => {
        if (!user) {
          return `User with id ${id} not found`;
        }
        return createResponse(user, 'User found successfully');
      })
      .catch((err) => {
        console.error('Error finding user', err);
        throw new Error('user not found');
      });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User> | string> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.userRepository
      .delete(id)
      .then((res) => {
        if (res.affected === 0) {
          return `User with id ${id} not found`;
        }
        return `User with id ${id} deleted successfully`;
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
        throw new Error('Failed to delete user');
      });
  }
}
