import { Injectable } from '@nestjs/common';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/dto/create-audit-log.dto';
import {
  complaint_status,
  complaint_priority,
} from '../complaints/dto/create-complaint.dto';
import { UpdateAuditLogDto } from 'src/audit-logs/dto/update-audit-log.dto';

@Injectable()
export class ComplaintAuditHelper {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * Log complaint creation
   */
  async logComplaintCreated(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    complaintTitle: string,
    priority: complaint_priority,
    location: string,
    categoryName?: string,
  ) {
    const categoryText = categoryName ? `, Category: ${categoryName}` : '';
    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.CREATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: `Created complaint #${complaintNumber}: "${complaintTitle}" [Priority: ${priority}, Location: ${location}${categoryText}]`,
      user_id: userId,
    });
  }

  /**
   * Log complaint status change
   */
  async logComplaintStatusChange(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    oldStatus: complaint_status,
    newStatus: complaint_status,
    reason?: string,
  ) {
    const reasonText = reason ? ` - Reason: ${reason}` : '';
    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: `Complaint #${complaintNumber}: Status changed from '${oldStatus}' to '${newStatus}'${reasonText}`,
      user_id: userId,
    });
  }

  /**
   * Log complaint priority change
   */
  async logComplaintPriorityChange(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    oldPriority: complaint_priority,
    newPriority: complaint_priority,
    reason?: string,
  ) {
    const reasonText = reason ? ` - Reason: ${reason}` : '';
    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: `Complaint #${complaintNumber}: Priority changed from '${oldPriority}' to '${newPriority}'${reasonText}`,
      user_id: userId,
    });
  }

  /**
   * Log complaint assignment to category
   */
  async logComplaintCategoryAssigned(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    categoryName: string,
    previousCategory?: string,
  ) {
    const categoryText = previousCategory
      ? `Category changed from '${previousCategory}' to '${categoryName}'`
      : `Assigned to category '${categoryName}'`;

    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: `Complaint #${complaintNumber}: ${categoryText}`,
      user_id: userId,
    });
  }

  /**
   * Log complaint deletion
   */
  async logComplaintDeleted(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    complaintTitle: string,
    reason?: string,
  ) {
    const reasonText = reason ? ` (Reason: ${reason})` : '';
    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.DELETE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: `Deleted complaint #${complaintNumber}: "${complaintTitle}"${reasonText}`,
      user_id: userId,
    });
  }

  /**
   * Log complaint resolution with details
   */
  async logComplaintResolved(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    resolutionNotes?: string,
    resolutionTime?: number,
  ) {
    let detailsText = `Complaint #${complaintNumber}: Marked as resolved`;
    if (resolutionNotes) {
      detailsText += ` - Notes: ${resolutionNotes}`;
    }
    if (resolutionTime) {
      detailsText += ` - Resolution time: ${resolutionTime} days`;
    }

    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: detailsText,
      user_id: userId,
    });
  }

  /**
   * Log complaint reopening
   */
  async logComplaintReopened(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    reason?: string,
  ) {
    const reasonText = reason ? ` - Reason: ${reason}` : '';
    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: `Complaint #${complaintNumber}: Reopened${reasonText}`,
      user_id: userId,
    });
  }

  /**
   * Log complaint assignment to user/department
   */
  async logComplaintAssigned(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    assignedTo: string,
    assignmentType: 'user' | 'department',
    previousAssignee?: string,
  ) {
    let detailsText = `Complaint #${complaintNumber}: `;

    if (previousAssignee) {
      detailsText += `Reassigned from ${previousAssignee} to ${assignedTo} (${assignmentType})`;
    } else {
      detailsText += `Assigned to ${assignedTo} (${assignmentType})`;
    }

    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: detailsText,
      user_id: userId,
    });
  }

  /**
   * Log complaint escalation
   */
  async logComplaintEscalated(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    escalatedTo: string,
    escalationLevel: string,
    reason?: string,
  ) {
    let detailsText = `Complaint #${complaintNumber}: Escalated to ${escalatedTo} (Level: ${escalationLevel})`;
    if (reason) {
      detailsText += ` - Reason: ${reason}`;
    }

    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: detailsText,
      user_id: userId,
    });
  }

  /**
   * Log complaint comment/note addition
   */
  async logComplaintCommentAdded(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    commentType: 'internal' | 'public',
    commentPreview?: string,
  ) {
    let detailsText = `Complaint #${complaintNumber}: Added ${commentType} comment`;
    if (commentPreview) {
      const preview =
        commentPreview.length > 50
          ? `${commentPreview.substring(0, 50)}...`
          : commentPreview;
      detailsText += ` - "${preview}"`;
    }

    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: detailsText,
      user_id: userId,
    });
  }

  /**
   * Log complaint attachment operations
   */
  async logComplaintAttachment(
    userId: string,
    complaintId: string,
    complaintNumber: number,
    action: 'added' | 'removed',
    fileName: string,
    fileSize?: number,
  ) {
    let detailsText = `Complaint #${complaintNumber}: ${action === 'added' ? 'Added' : 'Removed'} attachment "${fileName}"`;
    if (fileSize && action === 'added') {
      detailsText += ` (${(fileSize / 1024).toFixed(1)} KB)`;
    }

    return this.auditLogsService.create({
      actor_id: userId,
      action: AuditAction.UPDATE,
      resource: 'Complaint',
      resource_id: complaintId,
      details: detailsText,
      user_id: userId,
    });
  }

  /**
   * Log bulk complaint operations
   */
  async logBulkComplaintOperation(
    userId: string,
    operation: string,
    complaintIds: string[],
    additionalInfo?: Record<string, any>,
  ) {
    const detailsText = `Bulk operation: ${operation} on ${complaintIds.length} complaints${
      additionalInfo ? ` - ${JSON.stringify(additionalInfo)}` : ''
    }`;

    // Log for each complaint individually
    const promises = complaintIds.map(async (complaintId, index) => {
      return this.auditLogsService.create({
        actor_id: userId,
        action: AuditAction.UPDATE,
        resource: 'Complaint',
        resource_id: complaintId,
        details: `${detailsText} - Complaint ${index + 1}/${complaintIds.length}`,
        user_id: userId,
      });
    });

    return Promise.all(promises);
  }

  /**
   * Get complaint audit history
   */
  async getComplaintAuditHistory(complaintId: string) {
    return this.auditLogsService.findByResource('Complaint', complaintId);
  }

  /**
   * Get user's complaint activity
   */
  async getUserComplaintActivity(userId: string) {
    return this.auditLogsService.findByUser(userId);
  }

  /**
   * Get complaint timeline
   */
  async getComplaintTimeline(complaintId: string) {
    return this.auditLogsService.getComplaintTimeline(complaintId);
  }

  /**
   * Get complaint audit summary
   */
  async getComplaintAuditSummary(complaintId: string) {
    return this.auditLogsService.getComplaintAuditSummary(complaintId);
  }

  /**
   * Get recent complaint activity
   */
  async getRecentComplaintActivity(days: number = 7) {
    return this.auditLogsService.getRecentComplaintActivity(days);
  }

  // update audit log
  async updateAuditLog(
    auditLogId: string,
    updateData: Partial<UpdateAuditLogDto>,
  ) {
    return this.auditLogsService.update(auditLogId, updateData);
  }

  // delete audit log
  async deleteAuditLog(auditLogId: string) {
    return this.auditLogsService.remove(auditLogId);
  }
}
