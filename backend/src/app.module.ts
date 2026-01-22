import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SymptomModule } from './symptom/symptom.module';
import { ConversationsModule } from './conversations/conversations.module';
import { User } from './entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: 'database.sqlite',
        entities: [User, Conversation, Message],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ConversationsModule,
    SymptomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
