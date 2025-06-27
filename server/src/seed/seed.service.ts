import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Check } from 'src/users/dto/create-user.dto';
import { ComplaintHistory } from 'src/complaint-history/entities/complaint-history.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { ComplaintStatus } from 'src/complaint-history/dto/create-complaint-history.dto';
import { AuditLog } from 'src/audit-logs/entities/audit-log.entity';
import { AuditAction } from 'src/audit-logs/dto/create-audit-log.dto';
import { NotificationType } from 'src/notifications/dto/create-notification.dto';
import { complaint_status } from 'src/complaints/dto/create-complaint.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(ComplaintHistory)
    private complaintHistoryRepository: Repository<ComplaintHistory>,

    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,

    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,

    private readonly dataSource: DataSource,
  ) {}

  // seed data
  async seed() {
    this.logger.log('Seeding database...');
    try {
      await this.clearTables();

      const categories = await this.seedCategories();
      const subcategories = await this.seedSubcategories();
      const users = await this.seedUsers();
      const complaints = await this.seedComplaints(
        users,
        categories,
        subcategories,
      );
      await this.seedComplaintHistory(complaints, users);
      await this.seedFeedback(users, complaints);
      await this.seedNotifications(users);
      await this.seedAuditLogs(users);
    } catch (error) {
      this.logger.error('Error during seeding process', error);
      throw error;
    }
  }

  // clear existing data
  private async clearTables() {
    this.logger.log('clearing tables...');

    // transcations
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // clear existing data
    try {
      // relationships constraints [key]
      await queryRunner.query('DELETE FROM audit_logs');
      await queryRunner.query('DELETE FROM complaint_history');
      await queryRunner.query('DELETE FROM feedbacks');
      await queryRunner.query('DELETE FROM notifications');
      await queryRunner.query('DELETE FROM complaints');
      await queryRunner.query('DELETE FROM subcategories');
      await queryRunner.query('DELETE FROM categories');
      await queryRunner.query('DELETE FROM users');

      await queryRunner.commitTransaction();
      this.logger.log('All tables cleared successfully');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to clear tables', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // seed users
  private async seedUsers() {
    this.logger.log('Seeding users...');
    const users: User[] = [];

    for (let user = 1; user < 200; user++) {
      const newUser = new User();
      newUser.full_name = faker.person.fullName();
      newUser.username = newUser.full_name.split(' ')[0];
      newUser.email = faker.internet.email();
      newUser.phone_number = faker.phone.number();
      newUser.status = faker.datatype.boolean() ? Check.ACTIVE : Check.INACTIVE;
      newUser.password = faker.internet.password();

      users.push(await this.userRepository.save(newUser));
    }
    this.logger.log(`Seeded ${users.length} users`);
    return users;
  }

  // seed categories
  private async seedCategories() {
    this.logger.log('Seeding categories...');
    const categories: Category[] = [];

    for (let i = 1; i <= 100; i++) {
      const newCategory = new Category();
      newCategory.category_name = faker.commerce.department();
      newCategory.description = faker.lorem.paragraph();

      categories.push(await this.categoryRepository.save(newCategory));
    }
    this.logger.log(`Seeded ${categories.length} categories`);
    return categories;
  }

  // seed subcategories
  private async seedSubcategories() {
    this.logger.log('Seeding subcategories...');
    const subcategories: Subcategory[] = [];

    const categories = await this.categoryRepository.find();

    for (let i = 1; i <= 100; i++) {
      const newSubcategory = new Subcategory();
      newSubcategory.subcategory_name = faker.commerce.productName();
      newSubcategory.description = faker.lorem.paragraph();
      newSubcategory.category = faker.helpers.arrayElement(categories);

      subcategories.push(await this.subcategoryRepository.save(newSubcategory));
    }
    this.logger.log(`Seeded ${subcategories.length} subcategories`);
    return subcategories;
  }

  //   seed complaints
  private async seedComplaints(
    users: User[],
    categories: Category[],
    subcategories: Subcategory[],
  ) {
    this.logger.log('Seeding complaints...');
    const complaints: Complaint[] = [];

    for (let i = 1; i <= 100; i++) {
      const complaint = new Complaint();
      complaint.complaint_title = faker.lorem.words(4);
      complaint.complaint_description = faker.lorem.paragraph();
      complaint.location = faker.location.streetAddress();
      complaint.complaint_status = faker.helpers.arrayElement(
        Object.values(complaint_status),
      );
      complaint.user = faker.helpers.arrayElement(users);
      complaint.category = faker.helpers.arrayElement(categories);
      complaint.subcategory = faker.helpers.arrayElement(subcategories);
      complaints.push(await this.complaintRepository.save(complaint));
    }

    this.logger.log(`Seeded ${complaints.length} complaints`);
    return complaints;
  }

  private async seedComplaintHistory(complaints: Complaint[], users: User[]) {
    this.logger.log('Seeding complaint history...');
    const histories: ComplaintHistory[] = [];

    for (let i = 0; i < 100; i++) {
      const history = new ComplaintHistory();
      history.remarks = faker.lorem.sentence();
      history.from_status = faker.helpers.arrayElement(
        Object.values(ComplaintStatus),
      );
      history.to_status = faker.helpers.arrayElement(
        Object.values(ComplaintStatus),
      );
      history.complaint = faker.helpers.arrayElement(complaints);
      history.user = faker.helpers.arrayElement(users);
      histories.push(await this.complaintHistoryRepository.save(history));
    }

    this.logger.log(`Seeded ${histories.length} complaint history records`);
    return histories;
  }

  private async seedFeedback(users: User[], complaints: Complaint[]) {
    this.logger.log('Seeding feedback...');
    const feedbacks: Feedback[] = [];

    for (let i = 0; i < 100; i++) {
      const feedback = new Feedback();
      feedback.message = faker.lorem.sentences(2);
      feedback.rating = faker.number.int({ min: 1, max: 5 });
      feedback.user = faker.helpers.arrayElement(users);
      feedback.complaint = faker.helpers.arrayElement(complaints);
      feedbacks.push(await this.feedbackRepository.save(feedback));
    }

    this.logger.log(`Seeded ${feedbacks.length} feedback entries`);
    return feedbacks;
  }

  private async seedNotifications(users: User[]) {
    this.logger.log('Seeding notifications...');
    const notifications: Notification[] = [];

    for (let i = 0; i < 100; i++) {
      const notification = new Notification();
      notification.message = faker.lorem.sentence();
      notification.title = faker.lorem.words(3);
      notification.type = faker.helpers.arrayElement(
        Object.values(NotificationType),
      );
      notification.user = faker.helpers.arrayElement(users);
      notification.is_read = faker.datatype.boolean();
      notifications.push(await this.notificationRepository.save(notification));
    }

    this.logger.log(`Seeded ${notifications.length} notifications`);
    return notifications;
  }

  private async seedAuditLogs(users: User[]) {
    this.logger.log('Seeding audit logs...');
    const logs: AuditLog[] = [];

    for (let i = 0; i < 100; i++) {
      const log = new AuditLog();
      log.action = faker.helpers.arrayElement(Object.values(AuditAction));
      log.resource = faker.lorem.sentence();
      log.resource_id = faker.string.uuid();
      log.details = faker.lorem.sentence();
      log.user = faker.helpers.arrayElement(users);
      logs.push(await this.auditLogRepository.save(log));
    }

    this.logger.log(`Seeded ${logs.length} audit logs`);
    return logs;
  }
}
