import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as Bycrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { currentUser } from 'src/types/jwtUser';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // create tokens
  private async createTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      // Generate access token
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_ACCESS_EXPIRATION_TIME',
          ),
        },
      ),

      // generate refresh token
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    // return the tokens
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await Bycrypt.genSalt(10);
    return await Bycrypt.hash(password, salt);
  }

  // compare passwords
  private async comparePasswords(
    oldPassword: string,
    password: string,
  ): Promise<boolean> {
    const res = await Bycrypt.compare(oldPassword, password);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  // save refresh token in the database
  private async saveRefreshToken(userId: string, refreshToken: string) {
    // hash the refresh token
    const hashedRefreshToken = await this.hashPassword(refreshToken);

    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  // sign in users
  async signIn(CreateAuthDto: CreateAuthDto) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: CreateAuthDto.email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // compare passwords
    const isPasswordValid = await Bycrypt.compare(
      CreateAuthDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid Credentials');
    }

    // create tokens
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    // save refresh token in the database
    await this.saveRefreshToken(user.id, refreshToken);

    // return tokens
    return { accessToken, refreshToken };
  }

  // sign out users
  async signOut(userId: string) {
    // refresh token to null
    const res = await this.userRepository.update(userId, {
      refreshToken: null,
    });

    if (res.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User signed out successfully' };
  }

  // refresh tokens
  async refreshTokens(userId: string, refreshToken: string) {
    // find user by id
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // check if refresh token is valid
    if (!user.refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }
    const isRefreshTokenValid = await Bycrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new NotFoundException('Invalid refresh token');
    }

    // generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await this.createTokens(user.id, user.email);

    return { accessToken, refreshToken: newRefreshToken };
  }

  // validate user
  async validateJwtUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const currentUser: currentUser = { id: user.id, role: user.role };

    return currentUser;
  }

  // change password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // validate the old password
    const isValid = await this.comparePasswords(oldPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    // hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // save password
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Password changed successfuly' };
  }
}
