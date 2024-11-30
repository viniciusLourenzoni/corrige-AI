import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Essay } from './essays.entity';
import { StatusCorrectionEnum } from './essays.interface';

import { User } from 'src/account/account.entity';

@Injectable()
export class EssaysService {
  constructor(
    @InjectRepository(Essay)
    private readonly essaysRepository: Repository<Essay>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEssay(
    studentId: string,
    title: string,
    content: string,
  ): Promise<string> {
    const student = await this.userRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException('Aluno não encontrado');
    }

    if (!content || content.trim() === '') {
      throw new BadRequestException(
        'O conteúdo da redação não pode estar vazio.',
      );
    }

    const essay = this.essaysRepository.create({
      student: { id: studentId },
      title,
      content,
    });

    const savedEssay = await this.essaysRepository.save(essay);
    if (savedEssay) return 'Redação enviada com sucesso!';
  }

  async getAllEssays(): Promise<Essay[]> {
    return await this.essaysRepository.find({
      relations: ['student'],
    });
  }

  async getEssaysByStudent(studentId: string): Promise<Essay[]> {
    return await this.essaysRepository.find({
      where: { student: { id: studentId } },
      relations: ['student'],
    });
  }

  async getEssayById(id: string): Promise<Essay> {
    const essay = await this.essaysRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!essay) {
      throw new NotFoundException('Redação não encontrada');
    }

    return essay;
  }

  async getPendingEssays(): Promise<Essay[]> {
    return await this.essaysRepository.find({
      where: { status: StatusCorrectionEnum.PENDING },
    });
  }

  async updateEssayStatus(
    id: string,
    status: StatusCorrectionEnum,
  ): Promise<Essay> {
    await this.essaysRepository.update(id, { status });
    return await this.essaysRepository.findOneOrFail({ where: { id } });
  }

  async deleteEssayById(id: string): Promise<void> {
    const deleteResult = await this.essaysRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Essay with ID ${id} not found.`);
    }
  }
}
