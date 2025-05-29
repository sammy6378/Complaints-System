import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserLogsService } from './user-logs.service';
import { CreateUserLogDto } from './dto/create-user-log.dto';
import { UpdateUserLogDto } from './dto/update-user-log.dto';

@Controller('logs')
export class UserLogsController {
  constructor(private readonly userLogsService: UserLogsService) {}

  @Post('create')
  create(@Body() createUserLogDto: CreateUserLogDto) {
    return this.userLogsService.create(createUserLogDto);
  }

  @Get()
  findAll() {
    return this.userLogsService.findAll();
  }

  @Get('/log/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userLogsService.findOne(id);
  }

  @Patch('/log/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserLogDto: UpdateUserLogDto,
  ) {
    return this.userLogsService.update(id, updateUserLogDto);
  }

  @Delete('/log/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userLogsService.remove(id);
  }
}
