import { Injectable } from '@nestjs/common';
import { CreateAdminLogDto } from './dto/create-admin-log.dto';
import { UpdateAdminLogDto } from './dto/update-admin-log.dto';

@Injectable()
export class AdminLogsService {
  create(createAdminLogDto: CreateAdminLogDto) {
    return 'This action adds a new adminLog';
  }

  findAll() {
    return `This action returns all adminLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminLog`;
  }

  update(id: number, updateAdminLogDto: UpdateAdminLogDto) {
    return `This action updates a #${id} adminLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminLog`;
  }
}
