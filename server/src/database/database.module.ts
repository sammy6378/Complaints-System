// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { join } from 'path';

// // pnpm install --save @nestjs/typeorm typeorm mysql2 @nestjs/config

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         type: 'postgres',
//         host: configService.get('POSTGRES_HOST'),
//         port: parseInt(configService.get('POSTGRES_PORT') ?? '5432', 10),
//         username: configService.get('POSTGRES_USER'),
//         password: configService.get('POSTGRES_PASSWORD'),
//         database: configService.get('POSTGRES_DB'),
//         entities: [join(process.cwd(), 'dist/**/*.entity.js')],
//         synchronize: configService.get('DB_SYNC') === 'true',
//         logging: configService.get('DB_LOGGING') === 'true',
//         // migrations: [join(process.cwd(), '/../migrations/**/*{.js,ts}')],
//         // autoLoadEntities: true,
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
        const isProd = nodeEnv === 'production';
        const dbUrl = isProd
          ? configService.get<string>('DATABASE_URL')
          : configService.get<string>('POSTGRES_URL');

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
