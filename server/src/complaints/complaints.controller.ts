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
import { ComplaintsService } from './complaints.service';
import {
  complaint_priority,
  complaint_status,
  CreateComplaintDto,
} from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/dto/create-user.dto';

@UseGuards(RolesGuard)
@ApiTags('complaints')
@ApiBearerAuth()
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.create(createComplaintDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Get('qry')
  findFiltered(
    @Query('complaint_status') complaint_status?: complaint_status,
    @Query('priority') priority?: complaint_priority,
  ) {
    return this.complaintsService.findFiltered(complaint_status, priority);
  }

  @ApiOperation({ summary: 'Find complaint by complaint number' })
  @ApiParam({
    name: 'number',
    description: 'Complaint number',
    example: '2340',
  })
  @Get(':number')
  findByComplaintNumber(@Param('number') complaintNumber: string) {
    return this.complaintsService.findByComplaintNumber(
      parseInt(complaintNumber),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    return this.complaintsService.update(id, updateComplaintDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintsService.remove(id);
  }
}
