import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Correction } from './correction.entity';
import { AiService } from 'src/shared/ai/ai.service';
import { Essay } from 'src/essays/essays.entity';

@Injectable()
export class CorrectionsService {
  constructor(
    @InjectRepository(Correction)
    private readonly correctionsRepository: Repository<Correction>,
    private readonly aiService: AiService,

    @InjectRepository(Essay)
    private readonly essaysRepository: Repository<Essay>,
  ) {}

  async createCorrectionWithAI(
    essayId: string,
    teacherId: string,
  ): Promise<Correction> {
    const essay = await this.essaysRepository.findOneOrFail({
      where: { id: essayId },
    });

    if (!essay.content) {
      throw new Error('A redação está vazia.');
    }

    const aiFeedbackDto = await this.aiService.generateFeedback(essay.content);

    const correction = this.correctionsRepository.create({
      essay: { id: essayId },
      teacher: { id: teacherId },
      aiFeedback: aiFeedbackDto.feedback,
      aiScore: aiFeedbackDto.score,
    });

    return await this.correctionsRepository.save(correction);
  }

  async getAllCorrections(): Promise<Correction[]> {
    return await this.correctionsRepository.find();
  }

  async updateCorrectionText(
    correctionId: string,
    correctionText: string,
  ): Promise<Correction> {
    const correction = await this.correctionsRepository.findOneOrFail({
      where: { id: correctionId },
    });
    correction.correctionText = correctionText;

    return await this.correctionsRepository.save(correction);
  }

  async getCorrectionsByEssay(essayId: string): Promise<Correction[]> {
    return await this.correctionsRepository.find({
      where: { essay: { id: essayId } },
      relations: ['essay', 'teacher'],
    });
  }

  async deleteCorrectionById(correctionId: string): Promise<void> {
    const deleteResult = await this.correctionsRepository.delete(correctionId);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        `Correction with ID ${correctionId} not found.`,
      );
    }
  }
}
