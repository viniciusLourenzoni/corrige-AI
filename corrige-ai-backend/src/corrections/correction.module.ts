import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorrectionsController } from './correction.controller';
import { CorrectionsService } from './correction.service';
import { Correction } from './correction.entity';
import { AiModule } from '../shared/ai/ai.module';
import { EssaysModule } from 'src/essays/essays.module';

@Module({
  imports: [TypeOrmModule.forFeature([Correction]), EssaysModule, AiModule],
  controllers: [CorrectionsController],
  providers: [CorrectionsService],
  exports: [CorrectionsService],
})
export class CorrectionsModule {}
