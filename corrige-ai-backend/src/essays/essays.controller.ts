import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { EssaysService } from './essays.service';
import { Essay } from './essays.entity';
import { StatusCorrectionEnum } from './essays.interface';

@Controller('essays')
export class EssaysController {
  constructor(private readonly essaysService: EssaysService) {}

  @Post()
  async createEssay(
    @Body('studentId') studentId: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<string> {
    return await this.essaysService.createEssay(studentId, title, content);
  }

  @Get()
  async getAllEssays(): Promise<Essay[]> {
    return await this.essaysService.getAllEssays();
  }

  @Get('student/:studentId')
  async getEssaysByStudent(
    @Param('studentId') studentId: string,
  ): Promise<Essay[]> {
    return await this.essaysService.getEssaysByStudent(studentId);
  }

  @Get(':id')
  async getEssayById(@Param('id') id: string): Promise<Essay> {
    return await this.essaysService.getEssayById(id);
  }

  @Get('pending')
  async getPendingEssays(): Promise<Essay[]> {
    return await this.essaysService.getPendingEssays();
  }

  @Patch(':id/status')
  async updateEssayStatus(
    @Param('id') id: string,
    @Body('status') status: StatusCorrectionEnum,
  ): Promise<Essay> {
    return await this.essaysService.updateEssayStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEssayById(@Param('id') id: string): Promise<void> {
    return await this.essaysService.deleteEssayById(id);
  }
}
