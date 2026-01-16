import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { AnalyzeDto } from './dto/symptom.dto';

@Controller('api')
export class SymptomController {
  constructor(private readonly symptomService: SymptomService) {}

  @Post('analyze')
  async analyze(@Body() analyzeDto: AnalyzeDto) {
    try {
      const result = await this.symptomService.analyzeSymptoms(analyzeDto.symptoms);
      return result;
    } catch (error) {
      throw new HttpException(
        { error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
