import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';
import * as Bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // hash password
  private async hashPassword(password: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return await Bcrypt.hash(password, salt);
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<Partial<User>>> {
    const newUser = {
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    };
    return await this.userRepository
      .save(newUser)
      .then((user) => {
        const userWithoutPassword = instanceToPlain(user);
        return createResponse(userWithoutPassword, 'User created successfully');
      })
      .catch((err) => {
        console.error('Error creating user:', err);
        throw new Error('Failed to create user');
      });
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: [
        'id',
        'full_name',
        'email',
        'phone_number',
        'username',
        'refreshToken',
        'status',
        'role',
      ],
      take: 50,
    });
    return users;
  }

  async findOne(id: string): Promise<ApiResponse<Partial<User>> | string> {
    return await this.userRepository
      .findOneBy({ id })
      .then((user) => {
        if (!user) {
          return `User with id ${id} not found`;
        }
        const userWithoutPassword = instanceToPlain(user);
        return createResponse(userWithoutPassword, 'User found successfully');
      })
      .catch((err) => {
        console.error('Error finding user', err);
        throw new Error('user not found');
      });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<Partial<User>> | string> {
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
