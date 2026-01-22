import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message, MessageSender } from '../entities/message.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createConversation(userId: string, title: string): Promise<Conversation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const conversation = this.conversationRepository.create({
      title,
      user,
    });

    return this.conversationRepository.save(conversation);
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { user: { id: userId } },
      relations: ['messages'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getConversation(conversationId: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, user: { id: userId } },
      relations: ['messages'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async addMessage(
    conversationId: string,
    userId: string,
    content: string,
    sender: MessageSender,
  ): Promise<Message> {
    const conversation = await this.getConversation(conversationId, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const message = this.messageRepository.create({
      content,
      sender,
      user,
      conversation,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Update conversation's last message
    conversation.lastMessage = content;
    await this.conversationRepository.save(conversation);

    return savedMessage;
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.getConversation(conversationId, userId);
    await this.conversationRepository.remove(conversation);
  }
}