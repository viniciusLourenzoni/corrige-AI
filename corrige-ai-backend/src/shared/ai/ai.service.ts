import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AiFeedbackDto } from './ai.dto';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateFeedback(essayContent: string): Promise<AiFeedbackDto> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente especializado em avaliar e dar feedback detalhado sobre redações. Suas respostas devem ser claras, construtivas e respeitosas, destacando pontos positivos e sugerindo melhorias de acordo com o modelo de redação fornecido, por exemplo (Enem, Concurso, etc).',
          },
          {
            role: 'user',
            content: `Avalie e forneça o feedback detalhado e uma nota de 0 a 10 para a seguinte redação:\n\n"${essayContent}"`,
          },
        ],
      });

      const feedback =
        response.choices[0].message?.content || 'Feedback não gerado.';

      const scoreMatch = feedback.match(/Nota final:\s*(\d+(\.\d+)?)/);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

      return {
        feedback,
        score,
      };
    } catch (error) {
      console.error('Erro ao gerar feedback:', error.message);
      throw new Error(
        'Houve um erro ao gerar o feedback. Por favor, tente novamente mais tarde.',
      );
    }
  }
}
