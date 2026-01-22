import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageSender } from '../entities/message.entity';

@Controller('api/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async createConversation(
    @Request() req,
    @Body() body: { title: string },
  ) {
    return this.conversationsService.createConversation(req.user.id, body.title);
  }

  @Get()
  async getUserConversations(@Request() req) {
    return this.conversationsService.getUserConversations(req.user.id);
  }

  @Get(':id')
  async getConversation(@Request() req, @Param('id') conversationId: string) {
    return this.conversationsService.getConversation(conversationId, req.user.id);
  }

  @Post(':id/messages')
  async addMessage(
    @Request() req,
    @Param('id') conversationId: string,
    @Body() body: { content: string; sender: MessageSender },
  ) {
    return this.conversationsService.addMessage(
      conversationId,
      req.user.id,
      body.content,
      body.sender,
    );
  }

  @Delete(':id')
  async deleteConversation(@Request() req, @Param('id') conversationId: string) {
    await this.conversationsService.deleteConversation(conversationId, req.user.id);
    return { message: 'Conversation deleted successfully' };
  }
}