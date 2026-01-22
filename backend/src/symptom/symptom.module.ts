import { Module } from '@nestjs/common';
import { SymptomController } from './symptom.controller';
import { EnhancedSymptomService } from './enhanced-symptom.service';

@Module({
  controllers: [SymptomController],
  providers: [EnhancedSymptomService],
})
export class SymptomModule {}
