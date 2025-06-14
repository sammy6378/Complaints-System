import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailService: MailService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const user = await this.userRepository.findOneBy({
      id: createNotificationDto.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user,
    });

    const subject = notification.title;
    const recipients = notification.user.full_name;

    const data = {
      email: recipients,
    };
    // send notification to the user
    await this.mailService.sendEmail({
      subject,
      template: 'message.ejs',
      recipients,
      data,
    });

    return await this.notificationRepository.save(notification);
  }

  async bulkCreate(
    createNotificationDtos: CreateNotificationDto[],
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const dto of createNotificationDtos) {
      const user = await this.userRepository.findOneBy({ id: dto.userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }

      const notification = this.notificationRepository.create({
        ...dto,
        user,
      });

      notifications.push(notification);
    }

    if (notifications.length === 0) {
      throw new NotFoundException('No valid notifications to create');
    }

    const recipients = notifications.map((n) => n.user.email);

    // Use the first notification's title as the subject
    const subject = notifications[0].title;

    await this.mailService.sendEmail({
      subject,
      template: 'bulksms.ejs',
      recipients,
      data: {
        notifications,
      },
    });

    return await this.notificationRepository.save(notifications);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOneBy({ id });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.notificationRepository.update(id, updateNotificationDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<string> {
    const result = await this.notificationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return `Notification with ID ${id} removed successfully`;
  }
}
