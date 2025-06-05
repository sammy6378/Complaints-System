import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from './decorators/public.decorator';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    refreshToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // auth/signin
  @Public()
  @Post('signin')
  async signIn(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.signIn(createAuthDto);
  }

  //   auth/signout
  @UseGuards(AtGuard)
  @Post('signout/:id')
  async signOut(@Param('id') id: string) {
    return await this.authService.signOut(id);
  }

  //   auth/refresh/:id
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh/:id')
  async refreshTokens(@Param('id') id: string, @Req() req: RequestWithUser) {
    // Extract the refresh token from the request
    const user = req.user;
    if (user.sub !== id) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return await this.authService.refreshTokens(id, user.refreshToken);
  }
}
