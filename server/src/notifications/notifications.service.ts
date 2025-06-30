import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

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
  ): Promise<ApiResponse<Notification>> {
    const user = await this.userRepository.findOneBy({
      user_id: createNotificationDto.user_id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user,
    });

    const subject = notification.title;
    const recipients = notification.user.email;

    // send notification to the user
    await this.mailService.sendEmail({
      subject,
      template: 'message.ejs',
      recipients,
      context: {
        email: recipients,
      },
    });

    const res = await this.notificationRepository.save(notification);
    if (!res) {
      throw new NotFoundException('Failed to create notification');
    }
    return createResponse(res, 'Notification created successfully');
  }

  async bulkCreate(
    createNotificationDtos: CreateNotificationDto[],
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const dto of createNotificationDtos) {
      const user = await this.userRepository.findOneBy({
        user_id: dto.user_id,
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.user_id} not found`);
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
      context: {
        notifications,
      },
    });

    return await this.notificationRepository.save(notifications);
  }

  async findAll(): Promise<ApiResponse<Notification[]>> {
    const res = await this.notificationRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
    if (!res || res.length === 0) {
      throw new NotFoundException('No notifications found');
    }
    return createResponse(res, 'Notifications retrieved successfully');
  }

  async findOne(id: string): Promise<ApiResponse<Notification>> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return createResponse(notification, 'Notification found successfully');
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<ApiResponse<Notification>> {
    const notification = await this.notificationRepository.findOneBy({ id });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.notificationRepository.update(id, updateNotificationDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    const result = await this.notificationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return createResponse(
      null,
      `Notification with ID ${id} deleted successfully`,
    );
  }
}
