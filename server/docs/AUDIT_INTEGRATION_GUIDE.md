# Integrating Audit Logs with Complaints System

## Step 1: Add AuditHelper to Complaints Module

First, add the AuditHelper to your complaints module:

```typescript
// complaints.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint } from './entities/complaint.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module'; // Add this
import { AuditHelper } from 'src/utils/audit-helper.service'; // Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, User, Category]),
    AuditLogsModule, // Add this
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, AuditHelper], // Add AuditHelper
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
```

## Step 2: Modify Complaints Service

Add audit logging to your complaints service:

```typescript
// complaints.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditHelper } from 'src/utils/audit-helper.service'; // Add this

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private auditHelper: AuditHelper, // Add this
  ) {}

  async create(createComplaintDto: CreateComplaintDto, currentUserId: string): Promise<ApiResponse<Complaint>> {
    // ... existing create logic ...
    
    const res = await this.complaintRepository.save(complaint);
    
    // Add audit log
    await this.auditHelper.logComplaintCreated(
      currentUserId,
      res.complaint_id,
      res.complaint_number,
      res.complaint_title
    );
    
    return createResponse(res, `Complaint #${res.complaint_number} created successfully`);
  }

  async findOne(id: string, currentUserId: string): Promise<ApiResponse<Complaint>> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user', 'category', 'subcategory'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    // Log that someone viewed this complaint
    await this.auditHelper.logComplaintViewed(
      currentUserId,
      complaint.complaint_id,
      complaint.complaint_number
    );

    return createResponse(complaint, 'Complaint found successfully');
  }

  async update(id: string, updateComplaintDto: UpdateComplaintDto, currentUserId: string): Promise<ApiResponse<Complaint | string>> {
    const existingComplaint = await this.complaintRepository.findOneBy({ complaint_id: id });
    
    if (!existingComplaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    // Store old values for audit trail
    const oldStatus = existingComplaint.complaint_status;
    const oldPriority = existingComplaint.priority;

    await this.complaintRepository.update(id, updateComplaintDto);
    
    // Log status change if it changed
    if (updateComplaintDto.complaint_status && updateComplaintDto.complaint_status !== oldStatus) {
      await this.auditHelper.logComplaintStatusChange(
        currentUserId,
        id,
        existingComplaint.complaint_number,
        oldStatus,
        updateComplaintDto.complaint_status
      );
    }

    // Log priority change if it changed
    if (updateComplaintDto.priority && updateComplaintDto.priority !== oldPriority) {
      await this.auditHelper.logComplaintPriorityChange(
        currentUserId,
        id,
        existingComplaint.complaint_number,
        oldPriority,
        updateComplaintDto.priority
      );
    }

    const updatedComplaint = await this.findOne(id, currentUserId);
    return updatedComplaint;
  }

  async remove(id: string, currentUserId: string): Promise<ApiResponse<string | null>> {
    const complaint = await this.complaintRepository.findOneBy({ complaint_id: id });
    
    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    // Log before deletion
    await this.auditHelper.logComplaintDeleted(
      currentUserId,
      complaint.complaint_id,
      complaint.complaint_number,
      complaint.complaint_title
    );

    const result = await this.complaintRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return createResponse(null, `Complaint #${complaint.complaint_number} deleted successfully`);
  }
}
```

## Step 3: Update Controllers to Pass User ID

Modify your controllers to pass the current user ID:

```typescript
// complaints.controller.ts
import { Request } from 'express';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto, @Req() req: Request) {
    const currentUserId = req.user?.sub; // Assuming JWT payload has 'sub' field
    return this.complaintsService.create(createComplaintDto, currentUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const currentUserId = req.user?.sub;
    return this.complaintsService.findOne(id, currentUserId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
    @Req() req: Request
  ) {
    const currentUserId = req.user?.sub;
    return this.complaintsService.update(id, updateComplaintDto, currentUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const currentUserId = req.user?.sub;
    return this.complaintsService.remove(id, currentUserId);
  }
}
```

## Step 4: Create Audit Dashboard Endpoints

```typescript
// Create a new audit dashboard controller
// audit-dashboard.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/dto/create-user.dto';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('audit-dashboard')
export class AuditDashboardController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('complaint/:complaintId/history')
  getComplaintHistory(@Param('complaintId') complaintId: string) {
    return this.auditLogsService.findByResource('Complaint', complaintId);
  }

  @Get('user/:userId/activity')
  getUserActivity(@Param('userId') userId: string) {
    return this.auditLogsService.findByUser(userId);
  }

  @Get('statistics')
  getSystemStatistics() {
    return this.auditLogsService.getAuditStatistics();
  }

  @Get('recent-activity')
  getRecentActivity(@Query('limit') limit = '20') {
    // This would be a new method to get recent activity across all resources
    return this.auditLogsService.findAll();
  }
}
```

## Benefits You'll Get

1. **Complete Audit Trail**: Every action on every complaint is logged
2. **User Accountability**: Know exactly who did what and when
3. **Compliance Ready**: Automatic logging for regulatory requirements
4. **Security Monitoring**: Detect unusual patterns or unauthorized access
5. **Performance Insights**: Understand how your system is being used
6. **Debugging**: Quickly identify what happened when issues arise

## Example Audit Trail for a Complaint

```
Complaint #2340 Audit Trail:
┌─────────────────────┬──────────────┬─────────┬─────────────────────────────────────┐
│ Timestamp           │ User         │ Action  │ Details                             │
├─────────────────────┼──────────────┼─────────┼─────────────────────────────────────┤
│ 2025-06-30 09:15:23 │ john.doe     │ CREATE  │ Created complaint #2340: "Pothole"  │
│ 2025-06-30 10:22:11 │ admin.smith  │ VIEW    │ Viewed complaint #2340              │
│ 2025-06-30 11:45:33 │ admin.smith  │ UPDATE  │ Status: Pending → Under Review      │
│ 2025-06-30 14:30:15 │ supervisor   │ UPDATE  │ Priority: Low → High                │
│ 2025-07-01 09:15:44 │ maintenance  │ UPDATE  │ Status: Under Review → Resolved     │
│ 2025-07-01 16:45:11 │ admin.smith  │ VIEW    │ Viewed complaint #2340              │
└─────────────────────┴──────────────┴─────────┴─────────────────────────────────────┘
```

This gives you complete transparency and accountability for every complaint in your system!
