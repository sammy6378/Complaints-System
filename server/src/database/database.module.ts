import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('POSTGRES_URL');
        return {
          type: 'postgres',
          url: dbUrl,
          entities: [join(process.cwd(), 'dist/**/*.entity.js')],
          synchronize: configService.get('DB_SYNC') === 'true',
          logging: configService.get('DB_LOGGING') === 'true',
          migrations: [join(process.cwd(), '/../migrations/**/*{.js,ts}')],
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
