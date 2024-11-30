import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { Correction } from './correction.entity';
import { CorrectionsService } from './correction.service';

@Controller('corrections')
export class CorrectionsController {
  constructor(private readonly correctionsService: CorrectionsService) {}

  @Post()
  async createCorrection(
    @Body('essayId') essayId: string,
    @Body('teacherId') teacherId: string,
  ): Promise<Correction> {
    return await this.correctionsService.createCorrectionWithAI(
      essayId,
      teacherId,
    );
  }

  @Get()
  async getAllCorrections(): Promise<Correction[]> {
    return await this.correctionsService.getAllCorrections();
  }

  @Patch(':id/text')
  async updateCorrectionText(
    @Param('id') correctionId: string,
    @Body('correctionText') correctionText: string,
  ): Promise<Correction> {
    return await this.correctionsService.updateCorrectionText(
      correctionId,
      correctionText,
    );
  }

  @Get('essay/:essayId')
  async getCorrectionsByEssay(
    @Param('essayId') essayId: string,
  ): Promise<Correction[]> {
    return await this.correctionsService.getCorrectionsByEssay(essayId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCorrectionById(@Param('id') correctionId: string): Promise<void> {
    return await this.correctionsService.deleteCorrectionById(correctionId);
  }
}
