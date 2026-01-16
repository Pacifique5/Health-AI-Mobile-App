import { Module } from '@nestjs/common';
import { SymptomController } from './symptom.controller';
import { SymptomService } from './symptom.service';

@Module({
  controllers: [SymptomController],
  providers: [SymptomService],
})
export class SymptomModule {}
