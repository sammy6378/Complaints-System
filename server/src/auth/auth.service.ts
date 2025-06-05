import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as Bycrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

  private async hashData(data: string): Promise<string> {
    const salt = await Bycrypt.genSalt(10);
    return await Bycrypt.hash(data, salt);
  }

  // save refresh token in the database
  private async saveRefreshToken(userId: string, refreshToken: string) {
    // hash the refresh token
    const hashedRefreshToken = await this.hashData(refreshToken);

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
}
