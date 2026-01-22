import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EnhancedSymptomService } from './enhanced-symptom.service';
import { AnalyzeDto } from './dto/symptom.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/symptoms')
export class SymptomController {
  constructor(private readonly symptomService: EnhancedSymptomService) {}

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  async analyze(@Body() analyzeDto: AnalyzeDto, @Request() req) {
    const result = await this.symptomService.analyzeSymptoms(analyzeDto.symptoms);
    return {
      ...result,
      userId: req.user.id,
      timestamp: new Date().toISOString(),
    };
  }
}
