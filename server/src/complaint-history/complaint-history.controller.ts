import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { ComplaintHistoryService } from './complaint-history.service';
import { CreateComplaintHistoryDto } from './dto/create-complaint-history.dto';
import { UpdateComplaintHistoryDto } from './dto/update-complaint-history.dto';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { UserRole } from 'src/users/dto/create-user.dto';

// @UseGuards(RolesGuard)
@Controller('complaint-history')
export class ComplaintHistoryController {
  constructor(
    private readonly complaintHistoryService: ComplaintHistoryService,
  ) {}

  @Post()
  create(@Body() createComplaintHistoryDto: CreateComplaintHistoryDto) {
    return this.complaintHistoryService.create(createComplaintHistoryDto);
  }

  // @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.complaintHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintHistoryService.findOne(id);
  }

  // @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplaintHistoryDto: UpdateComplaintHistoryDto,
  ) {
    return this.complaintHistoryService.update(id, updateComplaintHistoryDto);
  }

  // @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintHistoryService.remove(id);
  }
}
