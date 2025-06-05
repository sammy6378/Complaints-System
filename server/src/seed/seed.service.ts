import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminLog } from 'src/admin-logs/entities/admin-log.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { State } from 'src/states/entities/state.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { UserLog } from 'src/user-logs/entities/user-log.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Check } from 'src/users/dto/create-user.dto';
import { LoginStatus } from 'src/user-logs/dto/create-user-log.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserLog) private userLogRepository: Repository<UserLog>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(AdminLog)
    private adminLogRepository: Repository<AdminLog>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(State) private stateRepository: Repository<State>,
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    private readonly dataSource: DataSource,
  ) {}

  // seed data
  async seed() {
    this.logger.log('Seeding database...');
    try {
      await this.clearTables();

      const states = await this.seedStates();
      const categories = await this.seedCategories();
      const subcategories = await this.seedSubcategories();
      const users = await this.seedUsers();
      const admins = await this.seedAdmins();

      await this.seedAdminLogs(admins);
      await this.seedUserLogs(users);
      await this.seedComplaints(users, categories, subcategories, states);
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
      await queryRunner.query('DELETE FROM complaints');
      await queryRunner.query('DELETE FROM user_logs');
      await queryRunner.query('DELETE FROM admin_logs');
      await queryRunner.query('DELETE FROM subcategories');
      await queryRunner.query('DELETE FROM categories');
      await queryRunner.query('DELETE FROM states');
      await queryRunner.query('DELETE FROM users');
      await queryRunner.query('DELETE FROM admins');

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
      newCategory.decription = faker.lorem.paragraph();

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
      newSubcategory.subcategoryName = faker.commerce.productName();
      newSubcategory.description = faker.lorem.paragraph();
      newSubcategory.category = faker.helpers.arrayElement(categories);

      subcategories.push(await this.subcategoryRepository.save(newSubcategory));
    }
    this.logger.log(`Seeded ${subcategories.length} subcategories`);
    return subcategories;
  }

  // seed states
  private async seedStates() {
    this.logger.log('Seeding states...');
    const states: State[] = [];

    for (let i = 1; i <= 100; i++) {
      const newState = new State();
      newState.state_name = faker.location.state();
      newState.description = faker.lorem.paragraph();
      states.push(await this.stateRepository.save(newState));
    }

    this.logger.log(`Seeded ${states.length} states`);
    return states;
  }

  //   seed admins
  private async seedAdmins() {
    this.logger.log('Seeding admins...');
    const admins: Admin[] = [];

    for (let i = 1; i <= 100; i++) {
      const admin = new Admin();
      admin.fullName = faker.person.fullName();
      admin.username = admin.fullName.split(' ')[0];
      admin.email = faker.internet.email();
      admin.password = faker.internet.password();
      admins.push(await this.adminRepository.save(admin));
    }

    this.logger.log(`Seeded ${admins.length} admins`);
    return admins;
  }

  //   seed admin logs
  private async seedAdminLogs(admins: Admin[]) {
    this.logger.log('Seeding admin logs...');
    const logs: AdminLog[] = [];

    for (let i = 1; i <= 100; i++) {
      const log = new AdminLog();
      log.LoginTime = faker.date.past();
      log.loginStatus = faker.datatype.boolean()
        ? LoginStatus.SUCCESS
        : LoginStatus.FAILURE;
      log.admin = faker.helpers.arrayElement(admins);
      logs.push(await this.adminLogRepository.save(log));
    }

    this.logger.log(`Seeded ${logs.length} admin logs`);
    return logs;
  }

  //   seed user logs
  private async seedUserLogs(users: User[]) {
    this.logger.log('Seeding user logs...');
    const logs: UserLog[] = [];

    for (let i = 1; i <= 100; i++) {
      const log = new UserLog();
      log.action = faker.lorem.words(3);
      log.loginStatus = faker.datatype.boolean()
        ? LoginStatus.SUCCESS
        : LoginStatus.FAILURE;
      log.user = faker.helpers.arrayElement(users);
      logs.push(await this.userLogRepository.save(log));
    }

    this.logger.log(`Seeded ${logs.length} user logs`);
    return logs;
  }

  //   seed complaints
  private async seedComplaints(
    users: User[],
    categories: Category[],
    subcategories: Subcategory[],
    states: State[],
  ) {
    this.logger.log('Seeding complaints...');
    const complaints: Complaint[] = [];

    for (let i = 1; i <= 100; i++) {
      const complaint = new Complaint();
      complaint.complaint_title = faker.lorem.words(4);
      complaint.complaint_description = faker.lorem.paragraph();
      complaint.user = faker.helpers.arrayElement(users);
      complaint.category = faker.helpers.arrayElement(categories);
      complaint.subcategory = faker.helpers.arrayElement(subcategories);
      complaint.state = faker.helpers.arrayElement(states);
      complaints.push(await this.complaintRepository.save(complaint));
    }

    this.logger.log(`Seeded ${complaints.length} complaints`);
    return complaints;
  }
}
