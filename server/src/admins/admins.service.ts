import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<ApiResponse<Admin>> {
    return await this.adminRepository
      .save(createAdminDto)
      .then((admin) => {
        return createResponse(admin, 'Admin created successfully');
      })
      .catch((err) => {
        console.error('Error creating admin:', err);
        throw new Error('Failed to create admin');
      });
  }

  async findAll(fullName?: string): Promise<Admin[]> {
    if (fullName) {
      return await this.adminRepository.find({
        where: { fullName },
      });
    }
    return await this.adminRepository.find();
  }

  async findOne(id: string): Promise<ApiResponse<Admin> | string> {
    return await this.adminRepository
      .findOneBy({ adminId: id })
      .then((admin) => {
        if (!admin) {
          return `Admin with id ${id} not found`;
        }
        return createResponse(admin, 'Admin found successfully');
      })
      .catch((err) => {
        console.error('Error finding admin:', err);
        throw new Error('Admin not found');
      });
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<ApiResponse<Admin> | string> {
    await this.adminRepository.update(id, updateAdminDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<string> {
    return await this.adminRepository
      .delete(id)
      .then((res) => {
        if (res.affected === 0) {
          return `Admin with id ${id} not found`;
        }
        return `Admin with id ${id} deleted successfully`;
      })
      .catch((err) => {
        console.error('Error deleting admin:', err);
        throw new Error('Failed to delete admin');
      });
  }
}
