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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/dto/create-user.dto';
import { CreatePaginationDto } from 'src/pagination/dto/create-pagination.dto';

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
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'pages of data returned',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit to number of rows returned',
    type: String,
  })
  @Get()
  findAll(@Query() paginatedQuery: CreatePaginationDto) {
    return this.complaintsService.findAll(paginatedQuery);
  }

  @Get('qry')
  findFiltered(
    @Query('complaint_status') complaint_status?: complaint_status,
    @Query('priority') priority?: complaint_priority,
  ) {
    return this.complaintsService.findFiltered(complaint_status, priority);
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
