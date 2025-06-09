import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/dto/create-user.dto';

@Controller('admins')
@Roles(UserRole.ADMIN)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Public()
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  findAll(@Query('email') email?: string) {
    return this.adminsService.findAll(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
