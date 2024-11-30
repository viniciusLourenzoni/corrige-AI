import { IsNumber, IsString, Max, Min } from 'class-validator';

export class AiFeedbackDto {
  @IsString()
  feedback: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;
}
