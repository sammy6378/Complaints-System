# Complaint-Focused Audit System Implementation

## Overview
The audit system has been streamlined to focus specifically on complaint management activities. This provides comprehensive tracking for all complaint-related operations.

## Key Components

### 1. ComplaintAuditHelper Service
Located in: `src/utils/audit-helper.service.ts`

**Purpose**: Provides complaint-specific audit logging methods with detailed context.

**Key Features**:
- ✅ Complaint creation logging with priority and location
- ✅ Status change tracking with before/after values  
- ✅ Priority change monitoring
- ✅ Detailed update logging (title, description, location changes)
- ✅ Category assignment tracking
- ✅ Complaint viewing/access logs
- ✅ Deletion logging with optional reason
- ✅ Resolution and reopening tracking

### 2. Enhanced AuditLogsService
**New Complaint-Specific Methods**:
- `getComplaintAuditStatistics()` - Complaint-focused analytics
- `getComplaintTimeline()` - Chronological history of a complaint
- `getRecentComplaintActivity()` - Recent complaint activities
- `getComplaintAuditSummary()` - Summary stats for a specific complaint

## How to Integrate with Your Complaints Service

### Step 1: Add to Complaints Module
```typescript
// complaints.module.ts
import { ComplaintAuditHelper } from 'src/utils/audit-helper.service';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, User, Category]),
    AuditLogsModule, // Add this
  ],
  providers: [ComplaintsService, ComplaintAuditHelper], // Add ComplaintAuditHelper
})
export class ComplaintsModule {}
```

### Step 2: Update Complaints Service
```typescript
// complaints.service.ts
import { ComplaintAuditHelper } from 'src/utils/audit-helper.service';

@Injectable()
export class ComplaintsService {
  constructor(
    // ... existing injections
    private complaintAuditHelper: ComplaintAuditHelper, // Add this
  ) {}

  async create(createComplaintDto: CreateComplaintDto, currentUserId: string) {
    // ... existing create logic
    
    const res = await this.complaintRepository.save(complaint);
    
    // Add audit logging
    await this.complaintAuditHelper.logComplaintCreated(
      currentUserId,
      res.complaint_id,
      res.complaint_number,
      res.complaint_title,
      res.priority,
      res.location,
    );
    
    return createResponse(res, `Complaint #${res.complaint_number} created successfully`);
  }

  async update(id: string, updateDto: UpdateComplaintDto, currentUserId: string) {
    const existingComplaint = await this.complaintRepository.findOneBy({ complaint_id: id });
    
    // Track what's being changed
    const changes: string[] = [];
    
    if (updateDto.complaint_status && updateDto.complaint_status !== existingComplaint.complaint_status) {
      await this.complaintAuditHelper.logComplaintStatusChange(
        currentUserId,
        id,
        existingComplaint.complaint_number,
        existingComplaint.complaint_status,
        updateDto.complaint_status,
      );
    }

    if (updateDto.priority && updateDto.priority !== existingComplaint.priority) {
      await this.complaintAuditHelper.logComplaintPriorityChange(
        currentUserId,
        id,
        existingComplaint.complaint_number,
        existingComplaint.priority,
        updateDto.priority,
      );
    }

    if (updateDto.complaint_title && updateDto.complaint_title !== existingComplaint.complaint_title) {
      changes.push('title');
    }
    
    if (updateDto.complaint_description && updateDto.complaint_description !== existingComplaint.complaint_description) {
      changes.push('description');
    }

    if (updateDto.location && updateDto.location !== existingComplaint.location) {
      changes.push('location');
    }

    if (changes.length > 0) {
      await this.complaintAuditHelper.logComplaintDetailsUpdated(
        currentUserId,
        id,
        existingComplaint.complaint_number,
        changes,
      );
    }

    await this.complaintRepository.update(id, updateDto);
    return await this.findOne(id, currentUserId);
  }

  async findOne(id: string, currentUserId: string) {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
      relations: ['user', 'category'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    // Log the viewing activity
    await this.complaintAuditHelper.logComplaintViewed(
      currentUserId,
      complaint.complaint_id,
      complaint.complaint_number,
    );

    return createResponse(complaint, 'Complaint found successfully');
  }
}
```

## API Endpoints for Complaint Auditing

### General Audit Endpoints
- `GET /audit-logs` - All audit logs (Admin only)
- `GET /audit-logs/user/:userId` - User's activity
- `GET /audit-logs/resource/Complaint/:complaintId` - Complaint's audit trail

### Complaint-Specific Audit Endpoints
- `GET /audit-logs/stats/complaints` - Complaint audit statistics
- `GET /audit-logs/complaints/:complaintId/timeline` - Complaint timeline
- `GET /audit-logs/complaints/recent-activity?days=7` - Recent complaint activity
- `GET /audit-logs/complaints/:complaintId/summary` - Complaint audit summary

## Example Audit Trail for Complaint #2340

```json
{
  "data": [
    {
      "audit_id": "uuid-1",
      "action": "CREATE",
      "resource": "Complaint",
      "resource_id": "complaint-uuid",
      "details": "Created complaint #2340: \"Pothole on Main Street\" [Priority: High, Location: 123 Main St]",
      "created_at": "2025-06-30T09:15:23Z",
      "user": { "email": "citizen@example.com" }
    },
    {
      "audit_id": "uuid-2", 
      "action": "VIEW",
      "resource": "Complaint",
      "resource_id": "complaint-uuid",
      "details": "Viewed complaint #2340",
      "created_at": "2025-06-30T10:22:11Z",
      "user": { "email": "admin@city.gov" }
    },
    {
      "audit_id": "uuid-3",
      "action": "UPDATE", 
      "resource": "Complaint",
      "resource_id": "complaint-uuid",
      "details": "Complaint #2340: Status changed from 'Pending' to 'Under Review'",
      "created_at": "2025-06-30T11:45:33Z",
      "user": { "email": "admin@city.gov" }
    }
  ]
}
```

## Benefits

### 🎯 **Complaint-Focused Tracking**
- Every complaint action is logged with complaint number reference
- Detailed context for each change (what changed, from what to what)
- Timeline view of complaint lifecycle

### 📊 **Rich Analytics**
- Most active complaints
- Status change patterns  
- User activity on complaints
- Resolution time tracking

### 🔍 **Operational Insights**
- Which complaints get the most attention
- Common status change patterns
- User engagement with specific complaints
- Complete audit trail for any complaint

### 🛡️ **Compliance & Security**
- Complete accountability for all complaint actions
- Legal-ready audit trails
- User access tracking
- Change history preservation

## Next Steps

1. **Integrate the ComplaintAuditHelper** into your complaints service
2. **Test the audit logging** by creating, updating, and viewing complaints
3. **Use the analytics endpoints** to understand complaint patterns
4. **Set up monitoring** for unusual complaint activity patterns

Your complaint system now has enterprise-level audit capabilities focused specifically on complaint management! 🚀
