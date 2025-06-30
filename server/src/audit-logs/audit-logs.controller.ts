import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
  Query,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { UserRole } from 'src/users/dto/create-user.dto';

// @UseGuards(RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogsService.create(createAuditLogDto);
  }

  // @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.auditLogsService.findAll();
  }

  // @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }

  // @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuditLogDto: UpdateAuditLogDto,
  ) {
    return this.auditLogsService.update(id, updateAuditLogDto);
  }

  // @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditLogsService.remove(id);
  }

  /**
   * Get audit logs for a specific resource
   */
  // @Roles(UserRole.ADMIN)
  @Get('resource/:resource/:resourceId')
  findByResource(
    @Param('resource') resource: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.auditLogsService.findByResource(resource, resourceId);
  }

  /**
   * Get audit logs for a specific user
   */
  // @Roles(UserRole.ADMIN)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.auditLogsService.findByUser(userId);
  }

  /**
   * Get audit logs by action type
   */
  // @Roles(UserRole.ADMIN)
  @Get('action/:action')
  findByAction(@Param('action') action: string) {
    return this.auditLogsService.findByAction(action);
  }

  /**
   * Get audit logs within date range
   */
  // @Roles(UserRole.ADMIN)
  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.auditLogsService.findByDateRange(start, end);
  }

  /**
   * Get complaint timeline/history
   */
  // @Roles(UserRole.ADMIN)
  @Get('complaints/:complaintId/timeline')
  getComplaintTimeline(@Param('complaintId') complaintId: string) {
    return this.auditLogsService.getComplaintTimeline(complaintId);
  }

  /**
   * Get recent complaint activity
   */
  // @Roles(UserRole.ADMIN)
  @Get('complaints/recent-activity')
  getRecentComplaintActivity(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 7;
    return this.auditLogsService.getRecentComplaintActivity(daysNumber);
  }

  /**
   * Get complaint audit summary
   */
  // @Roles(UserRole.ADMIN)
  @Get('complaints/:complaintId/summary')
  getComplaintAuditSummary(@Param('complaintId') complaintId: string) {
    return this.auditLogsService.getComplaintAuditSummary(complaintId);
  }
}
