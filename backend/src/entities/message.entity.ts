import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';

export enum MessageSender {
  USER = 'user',
  AI = 'ai'
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'varchar',
    default: MessageSender.USER
  })
  sender: MessageSender;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}