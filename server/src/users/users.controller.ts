import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { AtGuard } from 'src/auth/guards/at.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Roles(UserRole.ADMIN)
  @Public()
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter users by email address',
    type: String,
  })
  @Get()
  findAll(@Query('email') email?: string) {
    return this.usersService.findAll(email);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
