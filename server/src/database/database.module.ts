import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

// pnpm install --save @nestjs/typeorm typeorm mysql2 @nestjs/config

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PGHOST'),
        port: parseInt(configService.get('PGPORT') ?? '5432', 10),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        database: configService.get('PGDATABASE'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: configService.get('DB_SYNC') === 'true',
        logging: configService.get('DB_LOGGING') === 'true',
        migrations: [join(process.cwd(), '/../migrations/**/*{.js,ts}')],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
