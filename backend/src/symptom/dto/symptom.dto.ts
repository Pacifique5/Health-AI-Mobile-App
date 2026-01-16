import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeDto {
  @IsNotEmpty()
  @IsString()
  symptoms: string;
}
