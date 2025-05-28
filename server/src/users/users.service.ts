import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository
      .save(createUserDto)
      .then((user) => {
        return user;
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

  async findOne(id: number): Promise<User | string> {
    return await this.userRepository
      .findOneBy({ id })
      .then((user) => {
        if (!user) {
          return `User with id ${id} not found`;
        }
        return user;
      })
      .catch((err) => {
        console.error('Error finding user', err);
        throw new Error('user not found');
      });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
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
